
import type { SocialPost } from '../socialMediaService';

export interface Message {
  from: string;
  to: string;
  content: any;
  type: 'request' | 'response' | 'broadcast';
  timestamp: number;
}

export interface AgentRole {
  name: string;
  description: string;
  model: string;
}

export interface AnalysisResult {
  engagementRate: number;
  reach: number;
  recommendations: string[];
}

export interface GrowthStrategy {
  strategy: string;
  actionItems: string[];
  timeline: string;
}
