
export interface AgentRole {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface AgentMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface AgentContext {
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}
