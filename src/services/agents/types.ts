
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
