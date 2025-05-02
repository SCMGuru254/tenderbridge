
export const AGENT_ROLES = {
  NEWS_ANALYZER: {
    name: "News Analyzer",
    description: "Analyzes supply chain news and extracts key insights",
    model: "facebook/bart-large-cnn"
  },
  JOB_MATCHER: {
    name: "Job Matcher",
    description: "Matches supply chain jobs with user profiles",
    model: "sentence-transformers/all-MiniLM-L6-v2"
  },
  CAREER_ADVISOR: {
    name: "Career Advisor",
    description: "Provides personalized career guidance",
    model: "facebook/bart-large-cnn"
  },
  SOCIAL_MEDIA_AGENT: {
    name: "Social Media Agent",
    description: "Handles social media content generation and posting",
    model: "facebook/bart-large-cnn"
  }
} as const;

export type AgentRoleKey = keyof typeof AGENT_ROLES;
