
import { AgentRole, AgentMessage, AgentContext } from './agents/types';
import { aiService } from './openaiService';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { errorHandler } from '@/utils/errorHandling';

export class AIAgentService {
  private agents: Map<AgentRole, any> = new Map();
  private activeAgent: AgentRole | null = null;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    // Initialize different agent types
    const roles: AgentRole[] = ['career_advisor', 'job_matcher', 'news_analyzer', 'social_media'];
    
    roles.forEach(role => {
      const context: AgentContext = {
        sessionId: 'default',
        metadata: {},
        history: []
      };
      
      this.agents.set(role, {
        role,
        context,
        isActive: false
      });
    });
  }

  async activateAgent(agentRole: AgentRole): Promise<void> {
    try {
      // Deactivate current agent
      if (this.activeAgent) {
        const currentAgent = this.agents.get(this.activeAgent);
        if (currentAgent) {
          currentAgent.isActive = false;
        }
      }

      // Activate new agent
      const newAgent = this.agents.get(agentRole);
      if (newAgent) {
        newAgent.isActive = true;
        this.activeAgent = agentRole;
        analytics.trackUserAction('agent-activated', agentRole);
      }
    } catch (error) {
      errorHandler.handleError(error, 'UNKNOWN');
      throw error;
    }
  }

  async processMessage(message: string, context?: AgentContext): Promise<AgentMessage> {
    try {
      performanceMonitor.startMeasure('agent-process-message');
      
      if (!this.activeAgent) {
        throw new Error('No active agent');
      }

      const agent = this.agents.get(this.activeAgent);
      if (!agent) {
        throw new Error('Agent not found');
      }

      // Build context for the AI
      const contextString = context ? JSON.stringify(context) : '';
      
      // Process message with AI service based on agent role
      let content: string;
      let confidence = 0.8;
      
      switch (this.activeAgent) {
        case 'career_advisor':
          content = await aiService.generateChatResponse(
            `Career advice request: ${message}`,
            `Role: Career Advisor specializing in supply chain careers. ${contextString}`
          );
          break;
        case 'job_matcher':
          content = await aiService.generateChatResponse(
            `Job matching query: ${message}`,
            `Role: Job matching specialist for supply chain positions. ${contextString}`
          );
          break;
        case 'news_analyzer':
          content = await aiService.generateChatResponse(
            `News analysis request: ${message}`,
            `Role: Supply chain news analyst. ${contextString}`
          );
          break;
        case 'social_media':
          content = await aiService.generateChatResponse(
            `Social media content request: ${message}`,
            `Role: Social media content creator for supply chain professionals. ${contextString}`
          );
          break;
        default:
          content = await aiService.generateChatResponse(message, contextString);
      }

      // Update agent history
      const userMessage: AgentMessage = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date()
      };
      agent.context.history.push(userMessage);

      const response: AgentMessage = {
        id: (Date.now() + 1).toString(),
        content,
        role: 'assistant',
        timestamp: new Date(),
        confidence
      };

      agent.context.history.push(response);
      analytics.trackUserAction('agent-message-processed', this.activeAgent);
      
      return response;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      
      // Return fallback response
      return {
        id: Date.now().toString(),
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
        role: 'assistant',
        timestamp: new Date(),
        confidence: 0.1
      };
    } finally {
      performanceMonitor.endMeasure('agent-process-message');
    }
  }

  getActiveAgent(): AgentRole | null {
    return this.activeAgent;
  }

  getAllAgents(): AgentRole[] {
    return Array.from(this.agents.keys());
  }
}

export const aiAgentService = new AIAgentService();
