
import { AgentRole, AgentMessage, AgentContext } from './agents/types';

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
        preferences: {},
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
    }
  }

  async processMessage(message: string, context?: AgentContext): Promise<AgentMessage> {
    if (!this.activeAgent) {
      throw new Error('No active agent');
    }

    const agent = this.agents.get(this.activeAgent);
    if (!agent) {
      throw new Error('Agent not found');
    }

    // Process message with the active agent
    return {
      id: Date.now().toString(),
      content: `${this.activeAgent} processed: ${message}`,
      role: this.activeAgent,
      timestamp: Date.now(),
      confidence: 0.8
    };
  }

  getActiveAgent(): AgentRole | null {
    return this.activeAgent;
  }

  getAllAgents(): AgentRole[] {
    return Array.from(this.agents.keys());
  }
}

export const aiAgentService = new AIAgentService();
