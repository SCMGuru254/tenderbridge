import { AIAgent, AGENT_ROLES, agentEventBus } from '../services/aiAgents';

async function testAIAgents() {
  // Initialize agents
  const newsAnalyzer = new AIAgent(AGENT_ROLES.NEWS_ANALYZER);
  const jobMatcher = new AIAgent(AGENT_ROLES.JOB_MATCHER);
  const careerAdvisor = new AIAgent(AGENT_ROLES.CAREER_ADVISOR);

  try {
    // Test News Analyzer
    console.log('Testing News Analyzer...');
    const newsContent = {
      title: "Supply Chain Disruptions in East Africa",
      content: "Recent port developments in Mombasa have led to significant improvements in cargo handling efficiency..."
    };
    const newsAnalysis = await newsAnalyzer.processNews(newsContent);
    console.log('News Analysis Result:', newsAnalysis);

    // Test Job Matcher
    console.log('\nTesting Job Matcher...');
    const jobs = [{
      title: "Supply Chain Manager",
      description: "Looking for an experienced supply chain manager with 5+ years experience in FMCG..."
    }];
    const userProfile = {
      experience: "7 years in supply chain management",
      skills: ["inventory management", "logistics", "procurement"]
    };
    const matchResults = await jobMatcher.matchJobs(jobs, userProfile);
    console.log('Job Matching Results:', matchResults);

    // Test Career Advisor
    console.log('\nTesting Career Advisor...');
    const careerQuery = {
      currentRole: "Logistics Coordinator",
      yearsExperience: 3,
      interests: ["supply chain analytics", "sustainability"]
    };
    const careerAdvice = await careerAdvisor.analyzeCareerPath(careerQuery);
    console.log('Career Advice:', careerAdvice);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
testAIAgents().then(() => {
  console.log('\nAI Agent tests completed');
}).catch(error => {
  console.error('Test execution failed:', error);
});