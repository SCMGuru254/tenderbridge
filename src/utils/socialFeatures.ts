
import { supabase } from '@/integrations/supabase/client';

export interface SocialShareData {
  platform: string;
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export interface EngagementMetrics {
  likes: number;
  shares: number;
  comments: number;
  views: number;
}

class SocialFeaturesService {
  async shareToSocial(data: SocialShareData): Promise<boolean> {
    try {
      const { platform, url, title, description } = data;
      
      switch (platform) {
        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
          window.open(twitterUrl, '_blank');
          break;
        case 'linkedin':
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
          window.open(linkedinUrl, '_blank');
          break;
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          window.open(facebookUrl, '_blank');
          break;
        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
          window.open(whatsappUrl, '_blank');
          break;
        default:
          console.warn(`Unsupported platform: ${platform}`);
          return false;
      }
      
      await this.trackShare(platform, url);
      return true;
    } catch (error) {
      console.error('Error sharing to social:', error);
      return false;
    }
  }

  async trackShare(platform: string, url: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_shares')
        .insert({
          platform,
          shared_url: url,
          shared_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  }

  async getEngagementMetrics(contentId: string, contentType: string): Promise<EngagementMetrics> {
    try {
      const { data, error } = await supabase
        .from('content_engagement')
        .select('*')
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || { likes: 0, shares: 0, comments: 0, views: 0 };
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      return { likes: 0, shares: 0, comments: 0, views: 0 };
    }
  }

  async updateEngagement(
    contentId: string, 
    contentType: string, 
    engagementType: 'like' | 'share' | 'comment' | 'view',
    increment: number = 1
  ): Promise<boolean> {
    try {
      const currentMetrics = await this.getEngagementMetrics(contentId, contentType);
      const updatedMetrics = {
        ...currentMetrics,
        [engagementType + 's']: (currentMetrics as any)[engagementType + 's'] + increment
      };

      const { error } = await supabase
        .from('content_engagement')
        .upsert({
          content_id: contentId,
          content_type: contentType,
          ...updatedMetrics,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating engagement:', error);
      return false;
    }
  }

  generateShareUrl(baseUrl: string, params?: Record<string, string>): string {
    const url = new URL(baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    return url.toString();
  }

  async createInviteLink(userId: string, referralCode?: string): Promise<string> {
    try {
      const baseUrl = window.location.origin;
      const inviteParams = {
        ref: userId,
        ...(referralCode && { code: referralCode })
      };
      
      const inviteUrl = this.generateShareUrl(`${baseUrl}/invite`, inviteParams);
      
      const { error } = await supabase
        .from('invite_links')
        .insert({
          user_id: userId,
          invite_url: inviteUrl,
          referral_code: referralCode,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return inviteUrl;
    } catch (error) {
      console.error('Error creating invite link:', error);
      return '';
    }
  }

  async trackReferral(referralCode: string, newUserId: string): Promise<boolean> {
    try {
      const { data: invite, error: fetchError } = await supabase
        .from('invite_links')
        .select('user_id')
        .eq('referral_code', referralCode)
        .single();

      if (fetchError || !invite) return false;

      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: invite.user_id,
          referred_id: newUserId,
          referral_code,
          created_at: new Date().toISO‌String()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error tracking referral:', error);
      return false;
    }
  }

  copyToClipboard(text: string): Promise<boolean> {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => false);
  }

  generateSocialMetaTags(data: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  }): Record<string, string> {
    const { title, description, image, url } = data;
    const currentUrl = url || window.location.href;
    
    return {
      'og:title': title,
      'og:description': description,
      'og:url': currentUrl,
      'og:type': 'website',
      ...(image && { 'og:image': image }),
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      ...(image && { 'twitter:image': image })
    };
  }
}

export const socialFeatures = new SocialFeaturesService();
