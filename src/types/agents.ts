
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
