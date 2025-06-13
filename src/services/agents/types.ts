
export type AgentRole = 'career_advisor' | 'job_matcher' | 'news_analyzer' | 'social_media';

export interface AgentMessage {
  id: string;
  content: string;
  role: AgentRole;
  timestamp: number;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface AgentContext {
  userId?: string;
  preferences?: Record<string, any>;
  history?: AgentMessage[];
}

export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
}
