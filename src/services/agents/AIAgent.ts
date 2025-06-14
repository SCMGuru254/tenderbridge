
import { EventEmitter } from '@/utils/BrowserEventEmitter';
import { AgentRole, AgentMessage, AgentContext } from './types';

export class AIAgent extends EventEmitter {
  protected role: AgentRole;
  protected context: AgentContext;
  protected isActive: boolean = false;

  constructor(role: AgentRole, context: AgentContext) {
    super();
    this.role = role;
    this.context = context;
  }

  async processMessage(message: string): Promise<AgentMessage> {
    console.log(`Agent ${this.role} processing message: ${message}`);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const response: AgentMessage = {
      id: Date.now().toString(),
      content: `Processed by ${this.role}: ${message}`,
      role: 'assistant',
      timestamp: new Date(),
      confidence: 0.8
    };

    return response;
  }

  activate() {
    this.isActive = true;
    this.emit('activated', { role: this.role });
  }

  deactivate() {
    this.isActive = false;
    this.emit('deactivated', { role: this.role });
  }

  getRole(): AgentRole {
    return this.role;
  }

  isAgentActive(): boolean {
    return this.isActive;
  }
}
