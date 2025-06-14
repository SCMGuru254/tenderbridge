
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
