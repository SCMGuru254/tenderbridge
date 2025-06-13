
import { describe, it, expect } from 'vitest';
import { AIAgent } from '@/services/agents/AIAgent';

describe('AIAgent', () => {
  it('should create an agent with correct role', () => {
    const agent = new AIAgent('career_advisor', {});
    expect(agent.getRole()).toBe('career_advisor');
  });

  it('should activate and deactivate correctly', () => {
    const agent = new AIAgent('job_matcher', {});
    
    expect(agent.isAgentActive()).toBe(false);
    
    agent.activate();
    expect(agent.isAgentActive()).toBe(true);
    
    agent.deactivate();
    expect(agent.isAgentActive()).toBe(false);
  });

  it('should process messages', async () => {
    const agent = new AIAgent('news_analyzer', {});
    const message = await agent.processMessage('test message');
    
    expect(message.content).toContain('test message');
    expect(message.role).toBe('news_analyzer');
  });
});
