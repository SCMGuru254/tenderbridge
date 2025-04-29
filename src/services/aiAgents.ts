import { initializeServices } from '@/config/security';
import { EventEmitter } from 'events';
import { socialMediaService, type SocialPost } from './socialMediaService';

// Initialize services with validated API keys
const { hf, isInitialized } = initializeServices();

if (!isInitialized) {
  console.error('AI services failed to initialize. Some features may not work.');
}

export const agentEventBus = new EventEmitter();

interface Message {
  from: string;
  to: string;
  content: any;
  type: 'request' | 'response' | 'broadcast';
  timestamp: number;
}

export const AGENT_ROLES = {
  NEWS_ANALYZER: {
    name: "News Analyzer",
    description: "Analyzes supply chain news and extracts key insights",
    model: "facebook/bart-large-cnn"
  },
  JOB_MATCHER: {
    name: "Job Matcher",
    description: "Matches supply chain jobs with user profiles",
    model: "sentence-transformers/all-MiniLM-L6-v2"
  },
  CAREER_ADVISOR: {
    name: "Career Advisor",
    description: "Provides personalized career guidance",
    model: "facebook/bart-large-cnn"
  },
  SOCIAL_MEDIA_AGENT: {
    name: "Social Media Agent",
    description: "Handles social media content generation and posting",
    model: "facebook/bart-large-cnn"
  }
};

export class AIAgent {
  private role: typeof AGENT_ROLES[keyof typeof AGENT_ROLES];
  private messageQueue: Message[] = [];

  constructor(role: typeof AGENT_ROLES[keyof typeof AGENT_ROLES]) {
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
    
    const response = await hf.textGeneration({
      model: this.role.model,
      inputs: `Analyze this supply chain news: ${JSON.stringify(content)}`,
      parameters: {
        max_length: 500,
        temperature: 0.7
      }
    });

    return response?.generated_text || null;
  }

  async matchJobs(jobs: any[], userProfile: any): Promise<any> {
    if (!hf) return null;

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
      score: this.calculateSimilarity(embeddings[index], userProfile.embeddings || [])
    }));
  }

  async analyzeCareerPath(content: any): Promise<any> {
    if (!hf) return null;

    const response = await hf.textGeneration({
      model: this.role.model,
      inputs: `Provide career guidance based on: ${JSON.stringify(content)}`,
      parameters: {
        max_length: 1000,
        temperature: 0.7
      }
    });

    return response?.generated_text || null;
  }

  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    // Implement cosine similarity
    if (!embedding1.length || !embedding2.length || embedding1.length !== embedding2.length) {
      return 0;
    }

    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const norm1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const norm2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));

    return norm1 && norm2 ? dotProduct / (norm1 * norm2) : 0;
  }

  public async makeAPICall<T>(callback: () => Promise<T>): Promise<T | null> {
    try {
      return await callback();
    } catch (error) {
      console.error(`API call error:`, error);
      return null;
    }
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

  async generateSocialPost(content: any, platforms: ('twitter' | 'linkedin' | 'facebook' | 'instagram')[]): Promise<SocialPost[]> {
    if (!hf || this.role.name !== "Social Media Agent") {
      return [];
    }

    return await this.makeAPICall('generate-social', async () => {
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

export const socialMediaAgent = new AIAgent(AGENT_ROLES.SOCIAL_MEDIA_AGENT);