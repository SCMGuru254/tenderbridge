
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'data' | 'error';
}

export interface AgentConfig {
  name: string;
  role: string;
  capabilities: string[];
  maxTokens?: number;
  temperature?: number;
}

export interface AgentResponse {
  content: string;
  data?: any;
  suggestions?: string[];
  error?: string;
}

export type AgentRole = 'career_advisor' | 'job_matcher' | 'news_analyzer' | 'social_media';

export interface AgentMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  confidence?: number;
}

export interface AgentContext {
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
  history?: AgentMessage[];
}
