
import { initializeServices } from '@/config/security';
import { socialMediaService, type SocialPost } from '../socialMediaService';
import { agentEventBus } from './eventBus';
import { Message, AgentRole, AnalysisResult, GrowthStrategy } from './types';
import { calculateSimilarity, makeAPICall } from './utils';

// Initialize services with validated API keys
const { hf, isInitialized } = initializeServices();

if (!isInitialized) {
  console.error('AI services failed to initialize. Some features may not work.');
}

export class AIAgent {
  private role: AgentRole;
  private messageQueue: Message[] = [];

  constructor(role: AgentRole) {
    this.role = role;
    this.setupMessageHandling();
  }

  private setupMessageHandling() {
    agentEventBus.on('message', (message: Message) => {
      if (message.to === this.role.name || message.to === 'all') {
        this.handleMessage(message);
      }
    });
  }

  public sendMessage(message: Message) {
    agentEventBus.emit('message', message);
  }

  private async handleMessage(message: Message) {
    this.messageQueue.push(message);
    
    switch (message.type) {
      case 'request':
        const response = await this.processRequest(message);
        this.sendMessage({
          from: this.role.name,
          to: message.from,
          content: response,
          type: 'response',
          timestamp: Date.now()
        });
        break;
      case 'broadcast':
        console.log(`${this.role.name} received broadcast: ${JSON.stringify(message.content)}`);
        break;
    }
  }

  async processNews(content: any): Promise<any> {
    if (!hf) return null;
    
    return await makeAPICall(async () => {
      const response = await hf.textGeneration({
        model: this.role.model,
        inputs: `Analyze this supply chain news: ${JSON.stringify(content)}`,
        parameters: {
          max_length: 500,
          temperature: 0.7
        }
      });

      return response?.generated_text || null;
    });
  }

  async matchJobs(jobs: any[], userProfile: any): Promise<any> {
    if (!hf) return [];

    return await makeAPICall(async () => {
      const response = await hf.featureExtraction({
        model: this.role.model,
        inputs: jobs.map(job => job.description),
      });

      if (!Array.isArray(response)) return [];

      // Convert response to embeddings array
      const embeddings = response.map(emb => {
        if (Array.isArray(emb)) return emb;
        if (typeof emb === 'object' && emb !== null && Array.isArray((emb as any).embeddings)) {
          return (emb as any).embeddings;
        }
        return [];
      });

      // Compare embeddings with user profile
      return jobs.map((job, index) => ({
        job,
        score: calculateSimilarity(embeddings[index], userProfile.embeddings || [])
      }));
    }) || [];
  }

  async analyzeCareerPath(content: any): Promise<any> {
    if (!hf) return null;

    return await makeAPICall(async () => {
      const response = await hf.textGeneration({
        model: this.role.model,
        inputs: `Provide career guidance based on: ${JSON.stringify(content)}`,
        parameters: {
          max_length: 1000,
          temperature: 0.7
        }
      });

      return response?.generated_text || null;
    });
  }

  private async processRequest(message: Message) {
    if (!hf) return null;

    switch (this.role.name) {
      case 'News Analyzer':
        return await this.processNews(message.content);
      case 'Job Matcher':
        return await this.matchJobs(message.content.jobs, message.content.userProfile);
      case 'Career Advisor':
        return await this.analyzeCareerPath(message.content);
      case 'Social Media Agent':
        return await this.generateSocialPost(message.content, message.content.platforms);
      default:
        return null;
    }
  }

  // Social media agent methods
  async generateSocialPost(content: any, platforms: ('twitter' | 'linkedin' | 'facebook' | 'instagram')[]): Promise<SocialPost[]> {
    if (!hf || this.role.name !== "Social Media Agent") {
      return [];
    }

    return await makeAPICall(async () => {
      const posts: SocialPost[] = [];

      for (const platform of platforms) {
        const maxLength = platform === 'twitter' ? 280 : 3000;
        
        const prompt = `Create a professional ${platform} post about: ${JSON.stringify(content)}. 
                       Keep it under ${maxLength} characters. 
                       Make it engaging and optimized for ${platform}.`;

        const generated = await hf.textGeneration({
          model: this.role.model,
          inputs: prompt,
          parameters: {
            max_length: maxLength,
            temperature: 0.7
          }
        });

        if (generated?.generated_text) {
          posts.push({
            platform,
            content: generated.generated_text.trim()
          });
        }
      }

      return posts;
    }) || [];
  }

  async generateProfessionalComment(post: any, platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'): Promise<string> {
    if (!hf || this.role.name !== "Social Media Agent") {
      return '';
    }

    return await makeAPICall(async () => {
      const prompt = `Generate a professional and engaging comment for this ${platform} post: ${JSON.stringify(post)}. 
                     The comment should be insightful, add value to the conversation, and maintain a professional tone.`;

      const generated = await hf.textGeneration({
        model: this.role.model,
        inputs: prompt,
        parameters: {
          max_length: platform === 'twitter' ? 140 : 500,
          temperature: 0.7
        }
      });

      return generated?.generated_text?.trim() || '';
    }) || '';
  }

  async analyzePostPerformance(post: SocialPost, metrics: any): Promise<AnalysisResult> {
    if (!hf || this.role.name !== "Social Media Agent") {
      return { engagementRate: 0, reach: 0, recommendations: [] };
    }

    return await makeAPICall(async () => {
      const prompt = `Analyze the performance of this social media post: ${JSON.stringify(post)} 
                     with metrics: ${JSON.stringify(metrics)}. 
                     Calculate engagement rate and reach, and provide specific recommendations 
                     for improving future posts.`;

      const generated = await hf.textGeneration({
        model: this.role.model,
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7
        }
      });

      if (!generated?.generated_text) {
        return { engagementRate: 0, reach: 0, recommendations: [] };
      }

      // Parse the AI response to extract metrics and recommendations
      const analysis = JSON.parse(generated.generated_text);
      return {
        engagementRate: analysis.engagementRate || 0,
        reach: analysis.reach || 0,
        recommendations: analysis.recommendations || []
      };
    }) || { engagementRate: 0, reach: 0, recommendations: [] };
  }

  async generateGrowthStrategy(platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram', 
                             currentMetrics: any): Promise<GrowthStrategy> {
    if (!hf || this.role.name !== "Social Media Agent") {
      return { strategy: '', actionItems: [], timeline: '' };
    }

    return await makeAPICall(async () => {
      const prompt = `Create a growth strategy for ${platform} based on current metrics: ${JSON.stringify(currentMetrics)}. 
                     Include specific action items and a realistic timeline for implementation.`;

      const generated = await hf.textGeneration({
        model: this.role.model,
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7
        }
      });

      if (!generated?.generated_text) {
        return { strategy: '', actionItems: [], timeline: '' };
      }

      // Parse the AI response to extract strategy components
      const strategy = JSON.parse(generated.generated_text);
      return {
        strategy: strategy.strategy || '',
        actionItems: strategy.actionItems || [],
        timeline: strategy.timeline || ''
      };
    }) || { strategy: '', actionItems: [], timeline: '' };
  }

  async shareToSocialMedia(posts: SocialPost[]): Promise<{ success: boolean; errors: string[] }> {
    if (this.role.name !== "Social Media Agent") {
      return { success: false, errors: ['Invalid agent role'] };
    }

    const results = await Promise.all(
      posts.map(post => socialMediaService.post(post))
    );

    const errors = results
      .filter(result => !result.success)
      .map(result => result.error || 'Unknown error')
      .filter((error): error is string => Boolean(error));

    return {
      success: errors.length === 0,
      errors
    };
  }
}
