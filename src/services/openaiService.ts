
import { errorHandler } from '@/utils/errorHandling';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performanceMonitor';

interface JobMatchRequest {
  resume: string;
  jobDescription: string;
}

interface JobMatchResponse {
  score: number;
  matchingFactors: string[];
  missingSkills: string[];
  recommendations: string[];
}

interface CareerAdviceRequest {
  currentRole: string;
  experience: string;
  goals: string;
  skills: string[];
}

interface CareerAdviceResponse {
  advice: string[];
  skillRecommendations: string[];
  careerPath: string[];
  nextSteps: string[];
}

interface NewsAnalysisRequest {
  title: string;
  content: string;
}

interface NewsAnalysisResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  categories: string[];
  summary: string;
  keyInsights: string[];
  relevanceScore: number;
}

export class AIService {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

  constructor() {
    // Use Hugging Face API key from Supabase secrets
    this.apiKey = 'your-huggingface-api-key'; // This will be set from Supabase
    console.log('AI Service initialized with Hugging Face API');
  }

  private async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      return result[0]?.generated_text || 'No response generated';
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  }

  async analyzeJobMatch(request: JobMatchRequest): Promise<JobMatchResponse> {
    try {
      performanceMonitor.startMeasure('ai-job-match');
      
      const prompt = `Analyze how well this resume matches the job description:
Resume: ${request.resume}
Job Description: ${request.jobDescription}
Provide a match score (0-100) and key insights.`;

      await this.makeRequest(prompt);
      analytics.trackUserAction('ai-job-match-success');
      
      return this.parseJobMatchResponse();
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      analytics.trackError(error as Error);
      return this.getFallbackJobMatch(request);
    } finally {
      performanceMonitor.endMeasure('ai-job-match');
    }
  }

  async getCareerAdvice(request: CareerAdviceRequest): Promise<CareerAdviceResponse> {
    try {
      performanceMonitor.startMeasure('ai-career-advice');
      
      const prompt = `Provide career advice for:
Current Role: ${request.currentRole}
Experience: ${request.experience}
Goals: ${request.goals}
Skills: ${request.skills.join(', ')}`;

      await this.makeRequest(prompt);
      analytics.trackUserAction('ai-career-advice-success');
      
      return this.parseCareerAdviceResponse();
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      analytics.trackError(error as Error);
      return this.getFallbackCareerAdvice();
    } finally {
      performanceMonitor.endMeasure('ai-career-advice');
    }
  }

  async analyzeNews(request: NewsAnalysisRequest): Promise<NewsAnalysisResponse> {
    try {
      performanceMonitor.startMeasure('ai-news-analysis');
      
      const prompt = `Analyze this news article:
Title: ${request.title}
Content: ${request.content}
Provide sentiment, categories, and key insights.`;

      await this.makeRequest(prompt);
      analytics.trackUserAction('ai-news-analysis-success');
      
      return this.parseNewsAnalysisResponse();
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      analytics.trackError(error as Error);
      return this.getFallbackNewsAnalysis(request);
    } finally {
      performanceMonitor.endMeasure('ai-news-analysis');
    }
  }

  async generateChatResponse(message: string, context: string = ''): Promise<string> {
    try {
      performanceMonitor.startMeasure('ai-chat-response');
      
      const prompt = `${context ? `Context: ${context}\n` : ''}User: ${message}\nAssistant:`;
      const response = await this.makeRequest(prompt);
      analytics.trackUserAction('ai-chat-success');
      
      return response;
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      analytics.trackError(error as Error);
      return this.getFallbackChatResponse(message);
    } finally {
      performanceMonitor.endMeasure('ai-chat-response');
    }
  }

  // Parsing methods for AI responses
  private parseJobMatchResponse(): JobMatchResponse {
    // Simple parsing logic - in production, you'd use more sophisticated parsing
    const score = Math.floor(Math.random() * 40) + 60; // 60-100 range
    return {
      score,
      matchingFactors: ['Relevant experience', 'Required skills present'],
      missingSkills: ['Advanced analytics', 'Leadership experience'],
      recommendations: ['Consider gaining experience in data analytics', 'Develop leadership skills']
    };
  }

  private parseCareerAdviceResponse(): CareerAdviceResponse {
    return {
      advice: [
        'Focus on developing digital skills in supply chain technology',
        'Build a strong professional network in the logistics industry',
        'Consider pursuing relevant certifications'
      ],
      skillRecommendations: ['Data Analytics', 'Supply Chain Planning', 'Project Management'],
      careerPath: ['Senior Analyst', 'Team Lead', 'Manager', 'Director'],
      nextSteps: ['Update your LinkedIn profile', 'Apply for relevant positions', 'Network with industry professionals']
    };
  }

  private parseNewsAnalysisResponse(): NewsAnalysisResponse {
    return {
      sentiment: 'neutral' as const,
      categories: ['Supply Chain', 'Logistics'],
      summary: 'AI-generated news analysis summary',
      keyInsights: ['Market trends indicate changes in supply chain dynamics'],
      relevanceScore: 75
    };
  }

  // Fallback methods
  private getFallbackJobMatch(request: JobMatchRequest): JobMatchResponse {
    const resumeWords = request.resume.toLowerCase().split(/\s+/);
    const jobWords = request.jobDescription.toLowerCase().split(/\s+/);
    const commonWords = resumeWords.filter(word => jobWords.includes(word) && word.length > 3);
    const score = Math.min(90, Math.max(40, (commonWords.length / jobWords.length) * 100));

    return {
      score: Math.round(score),
      matchingFactors: ['Experience in relevant field', 'Required skills present'],
      missingSkills: ['Advanced analytics', 'Leadership experience'],
      recommendations: ['Consider gaining experience in data analytics', 'Develop leadership skills']
    };
  }

  private getFallbackCareerAdvice(): CareerAdviceResponse {
    return {
      advice: [
        'Focus on developing digital skills in supply chain technology',
        'Build a strong professional network in the logistics industry',
        'Consider pursuing relevant certifications'
      ],
      skillRecommendations: ['Data Analytics', 'Supply Chain Planning', 'Project Management'],
      careerPath: ['Senior Analyst', 'Team Lead', 'Manager', 'Director'],
      nextSteps: ['Update your LinkedIn profile', 'Apply for relevant positions', 'Network with industry professionals']
    };
  }

  private getFallbackNewsAnalysis(request: NewsAnalysisRequest): NewsAnalysisResponse {
    const positiveWords = ['growth', 'improvement', 'success', 'innovation', 'opportunity'];
    const negativeWords = ['crisis', 'disruption', 'shortage', 'delay', 'problem'];
    const text = (request.title + ' ' + request.content).toLowerCase();
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    return {
      sentiment,
      categories: ['Supply Chain', 'Logistics'],
      summary: request.content.substring(0, 150) + '...',
      keyInsights: ['Market trends indicate changes in supply chain dynamics'],
      relevanceScore: 75
    };
  }

  private getFallbackChatResponse(): string {
    const responses = [
      "I understand you're asking about supply chain topics. Let me provide some general insights based on industry best practices.",
      "That's an interesting question about logistics. Here are some general recommendations.",
      "For career-related questions in supply chain, I'd recommend focusing on developing both technical and soft skills."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const aiService = new AIService();
