
import { AIAgent } from './AIAgent';
import { AGENT_ROLES } from './agentRoles';
import { agentEventBus, sendMessage } from './eventBus';

// Create and export agent instances
export const socialMediaAgent = new AIAgent(AGENT_ROLES.SOCIAL_MEDIA_AGENT);
export const jobMatcher = new AIAgent(AGENT_ROLES.JOB_MATCHER);
export const newsAnalyzer = new AIAgent(AGENT_ROLES.NEWS_ANALYZER);
export const careerAdvisor = new AIAgent(AGENT_ROLES.CAREER_ADVISOR);

// Re-export everything for backward compatibility
export * from './types';
export * from './agentRoles';
export * from './eventBus';
export * from './utils';
export { AIAgent } from './AIAgent';
