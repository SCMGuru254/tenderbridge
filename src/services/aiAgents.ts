import { supabase } from '@/integrations/supabase/client';
import { initializeServices } from '@/config/security';

// Initialize services with validated API keys
const { hf, isInitialized } = initializeServices();

if (!isInitialized) {
  console.error('AI services failed to initialize. Some features may not work.');
}

export const AGENT_ROLES = {
  NEWS_ANALYZER: {
    name: "News Analyzer",
    description: "Analyzes supply chain news and extracts key insights",
    model: "facebook/bart-large-cnn" // Free model for summarization
  },
  JOB_MATCHER: {
    name: "Job Matcher",
    description: "Matches supply chain jobs with user profiles",
    model: "sentence-transformers/all-MiniLM-L6-v2" // Free model for embeddings
  },
  CAREER_ADVISOR: {
    name: "Career Advisor",
    description: "Provides personalized career guidance",
    model: "facebook/bart-large-cnn" // Free model for text generation
  }
};

export class AIAgent {
  private role: typeof AGENT_ROLES[keyof typeof AGENT_ROLES];

  constructor(role: typeof AGENT_ROLES[keyof typeof AGENT_ROLES]) {
    this.role = role;
  }

  async processNews(news: any[]) {
    if (!hf) {
      console.error('Hugging Face service not initialized');
      return null;
    }

    if (this.role.name === "News Analyzer") {
      const newsText = news.map(item => `${item.title}: ${item.content}`).join('\n\n');
      
      try {
        const analysis = await hf.summarization({
          model: this.role.model,
          inputs: newsText,
          parameters: {
            max_length: 200,
            min_length: 50
          }
        });

        return {
          summary: analysis.summary_text,
          impact: this.analyzeImpact(analysis.summary_text),
          opportunities: this.extractOpportunities(analysis.summary_text)
        };
      } catch (error) {
        console.error('Error processing news:', error);
        return null;
      }
    }
  }

  async matchJobs(jobs: any[], userProfile: any) {
    if (!hf) {
      console.error('Hugging Face service not initialized');
      return null;
    }

    if (this.role.name === "Job Matcher") {
      try {
        // Get embeddings for user profile
        const userEmbedding = await hf.featureExtraction({
          model: this.role.model,
          inputs: JSON.stringify(userProfile)
        });

        // Get embeddings for jobs and calculate similarity
        const jobMatches = await Promise.all(
          jobs.map(async (job) => {
            const jobEmbedding = await hf.featureExtraction({
              model: this.role.model,
              inputs: `${job.title} ${job.description}`
            });

            const similarity = this.calculateSimilarity(userEmbedding, jobEmbedding);
            
            return {
              ...job,
              matchScore: similarity,
              reasons: this.generateMatchReasons(job, userProfile, similarity)
            };
          })
        );

        return jobMatches.sort((a, b) => b.matchScore - a.matchScore);
      } catch (error) {
        console.error('Error matching jobs:', error);
        return null;
      }
    }
  }

  async analyzeCareerPath(userProfile: any) {
    if (!hf) {
      console.error('Hugging Face service not initialized');
      return null;
    }

    if (this.role.name === "Career Advisor") {
      try {
        const prompt = `Analyze this career profile and suggest next steps: ${JSON.stringify(userProfile)}`;
        
        const analysis = await hf.textGeneration({
          model: this.role.model,
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7
          }
        });

        return {
          currentLevel: this.extractCurrentLevel(analysis.generated_text),
          nextSteps: this.extractNextSteps(analysis.generated_text),
          longTermGoal: this.extractLongTermGoal(analysis.generated_text)
        };
      } catch (error) {
        console.error('Error analyzing career path:', error);
        return null;
      }
    }
  }

  private analyzeImpact(text: string): string {
    const impactKeywords = {
      high: ['critical', 'major', 'significant', 'transform', 'revolution'],
      medium: ['change', 'develop', 'grow', 'expand', 'improve'],
      low: ['minor', 'small', 'adjust', 'update', 'modify']
    };

    const textLower = text.toLowerCase();
    if (impactKeywords.high.some(keyword => textLower.includes(keyword))) return 'HIGH';
    if (impactKeywords.medium.some(keyword => textLower.includes(keyword))) return 'MEDIUM';
    return 'LOW';
  }

  private extractOpportunities(text: string): string[] {
    const opportunityPatterns = [
      /opportunit(y|ies) for/i,
      /potential for/i,
      /could lead to/i,
      /enables/i
    ];

    return opportunityPatterns
      .map(pattern => text.match(pattern)?.[0])
      .filter(Boolean) as string[];
  }

  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    // Simple cosine similarity
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
  }

  private generateMatchReasons(job: any, profile: any, similarity: number): string[] {
    const reasons = [];
    if (similarity > 0.8) reasons.push("Excellent skill match");
    if (similarity > 0.6) reasons.push("Good experience alignment");
    if (similarity > 0.4) reasons.push("Relevant industry experience");
    return reasons;
  }

  private extractCurrentLevel(text: string): string {
    const levelPatterns = [
      /(entry|junior|associate|mid|senior|lead|principal|director|executive) level/i,
      /(beginner|intermediate|advanced|expert) in/i
    ];

    for (const pattern of levelPatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return "Current level not specified";
  }

  private extractNextSteps(text: string): string[] {
    return text
      .split('.')
      .filter(sentence => 
        sentence.includes('next') || 
        sentence.includes('should') || 
        sentence.includes('recommend')
      )
      .map(step => step.trim());
  }

  private extractLongTermGoal(text: string): string {
    const goalPattern = /long.?term goal.*?(?=\.|$)/i;
    const match = text.match(goalPattern);
    return match ? match[0] : "Long-term goal not specified";
  }
}

// Create agent instances
export const newsAnalyzer = new AIAgent(AGENT_ROLES.NEWS_ANALYZER);
export const jobMatcher = new AIAgent(AGENT_ROLES.JOB_MATCHER);
export const careerAdvisor = new AIAgent(AGENT_ROLES.CAREER_ADVISOR); 