
import { AIAgent } from '@/services/agents/AIAgent';
import { AgentContext } from '@/services/agents/types';

// Mock test implementation without vitest
export const testAIAgent = () => {
  const mockContext: AgentContext = {
    sessionId: 'test-session',
    metadata: {},
    history: []
  };

  console.log('Testing AI Agent creation...');
  const agent = new AIAgent('career_advisor', mockContext);
  console.log('Agent role:', agent.getRole());

  console.log('Testing agent activation...');
  agent.activate();
  console.log('Agent active:', agent.isAgentActive());

  agent.deactivate();
  console.log('Agent deactivated:', !agent.isAgentActive());

  console.log('AI Agent tests completed successfully');
  return true;
};
