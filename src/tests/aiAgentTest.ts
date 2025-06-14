
import { describe, it, expect } from 'vitest';
import { AIAgent } from '@/services/agents/AIAgent';
import { AgentContext } from '@/services/agents/types';

describe('AIAgent', () => {
  const mockContext: AgentContext = {
    sessionId: 'test-session',
    metadata: {},
    history: []
  };

  it('should create an agent with correct role', () => {
    const agent = new AIAgent('career_advisor', mockContext);
    expect(agent.getRole()).toBe('career_advisor');
  });

  it('should process messages correctly', async () => {
    const agent = new AIAgent('job_matcher', mockContext);
    const response = await agent.processMessage('Test message');
    
    expect(response).toBeDefined();
    expect(response.role).toBe('assistant');
    expect(response.content).toContain('job_matcher');
  });

  it('should activate and deactivate correctly', () => {
    const agent = new AIAgent('news_analyzer', mockContext);
    
    expect(agent.isAgentActive()).toBe(false);
    
    agent.activate();
    expect(agent.isAgentActive()).toBe(true);
    
    agent.deactivate();
    expect(agent.isAgentActive()).toBe(false);
  });
});
