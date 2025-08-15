export interface ResumeAnalysis {
  skills: string[];
  experienceLevel: string;
  industryMatches: Array<{
    industry: string;
    score: number;
  }>;
  recommendations: string[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type AgentRole = 
  | 'resume_analyzer'
  | 'career_advisor'
  | 'interview_coach'
  | 'skills_assessor'
  | 'job_matcher'
  | 'social_media_advisor';

export interface AgentResponse {
  message: string;
  analysis?: any;
  suggestions?: string[];
  nextSteps?: string[];
  error?: string;
}

export interface AgentRequest {
  role: AgentRole;
  query: string;
  context?: Record<string, any>;
}
