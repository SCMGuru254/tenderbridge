
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { rateLimiters } from '@/utils/rateLimiter';

// Conditionally import TwitterApi to handle cases where it's not available
let TwitterApi: any;
try {
  TwitterApi = require('twitter-api-v2').TwitterApi;
} catch (error) {
  console.warn('Twitter API client not available');
}

export interface SocialPost {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  content: string;
  media?: string[];
}

// Define type aliases for better readability
type SocialCredentials = Database['public']['Tables']['social_credentials']['Row'];
type SocialPlatform = SocialCredentials['platform'];

class SocialMediaService {
  private twitter?: any;
  private userId?: string;

  async initialize(userId: string) {
    this.userId = userId;
    await this.loadCredentials();
  }

  private async loadCredentials() {
    if (!this.userId) return;

    try {
      const { data: credentials, error } = await supabase
        .from('social_credentials')
        .select('*')
        .eq('user_id', this.userId);

      if (error) throw error;

      if (credentials?.length) {
        credentials.forEach((cred: SocialCredentials) => {
          if (cred.platform === 'twitter' && cred.credentials?.twitter && TwitterApi) {
            this.twitter = new TwitterApi(cred.credentials.twitter);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load social media credentials:', error);
    }
  }

  async post(post: SocialPost): Promise<{ success: boolean; error?: string }> {
    if (!this.userId) {
      return { success: false, error: 'Service not initialized' };
    }

    try {
      // Get the rate limiter instance
      const socialRateLimiter = await rateLimiters.socialMedia.getInstance();
      const rateLimit = await socialRateLimiter.limit(`${this.userId}-${post.platform}`);
      
      if (!rateLimit.success) {
        return { 
          success: false, 
          error: `Rate limit exceeded. Try again after ${new Date(rateLimit.reset).toLocaleTimeString()}` 
        };
      }

      switch (post.platform) {
        case 'twitter':
          if (!this.twitter) {
            return { success: false, error: 'Twitter not configured' };
          }
          await this.twitter.v2.tweet(post.content);
          break;

        case 'linkedin':
          const linkedinResponse = await fetch('https://api.linkedin.com/v2/shares', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              owner: `urn:li:organization:${process.env.LINKEDIN_ORGANIZATION_ID}`,
              text: {
                text: post.content
              },
              distribution: {
                feedDistribution: 'MAIN_FEED',
                targetEntities: [],
                thirdPartyDistributionChannels: []
              },
              content: {
                contentEntities: [],
                title: 'SupplyChain_KE Update'
              }
            })
          });
          if (!linkedinResponse.ok) throw new Error('LinkedIn post failed');
          break;

        case 'facebook':
          const fbResponse = await fetch(
            `https://graph.facebook.com/61575329135959/feed`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: post.content,
                access_token: process.env.FACEBOOK_ACCESS_TOKEN,
              }),
            }
          );
          if (!fbResponse.ok) throw new Error('Facebook post failed');
          break;

        case 'instagram':
          const igResponse = await fetch(
            `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ID}/media`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                caption: post.content,
                access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
              }),
            }
          );
          if (!igResponse.ok) throw new Error('Instagram post failed');
          break;

        default:
          throw new Error('Unsupported platform');
      }

      return { success: true };
    } catch (error) {
      console.error(`Social media post error:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async addPlatformCredentials(
    platform: SocialPlatform,
    credentials: SocialCredentials['credentials']
  ) {
    if (!this.userId) {
      throw new Error('Service not initialized');
    }

    try {
      const { error } = await supabase
        .from('social_credentials')
        .upsert({
          user_id: this.userId,
          platform,
          credentials,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      await this.loadCredentials();
    } catch (error) {
      console.error(`Failed to save ${platform} credentials:`, error);
      throw new Error(`Failed to save ${platform} credentials`);
    }
  }
}

export const socialMediaService = new SocialMediaService();
