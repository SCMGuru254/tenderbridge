import { errorHandler } from '@/utils/errorHandling';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performanceMonitor';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

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

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured. AI features will use fallback responses.');
    }
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async analyzeJobMatch(request: JobMatchRequest): Promise<JobMatchResponse> {
    try {
      performanceMonitor.startMeasure('ai-job-match');
      
      if (!this.apiKey) {
        return this.getFallbackJobMatch(request);
      }

      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are an expert HR analyst specializing in supply chain and logistics roles. Analyze how well a resume matches a job description. Provide a detailed analysis including:
          1. Match score (0-100)
          2. Matching factors (skills, experience, qualifications that align)
          3. Missing skills or qualifications
          4. Recommendations for improvement
          
          Respond in JSON format with the structure:
          {
            "score": number,
            "matchingFactors": string[],
            "missingSkills": string[],
            "recommendations": string[]
          }`
        },
        {
          role: 'user',
          content: `Resume:\n${request.resume}\n\nJob Description:\n${request.jobDescription}`
        }
      ];

      const response: OpenAIResponse = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.3,
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content);
      analytics.trackUserAction('ai-job-match-success', `score:${result.score}`);
      
      return result;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return this.getFallbackJobMatch(request);
    } finally {
      performanceMonitor.endMeasure('ai-job-match');
    }
  }

  async getCareerAdvice(request: CareerAdviceRequest): Promise<CareerAdviceResponse> {
    try {
      performanceMonitor.startMeasure('ai-career-advice');
      
      if (!this.apiKey) {
        return this.getFallbackCareerAdvice(request);
      }

      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are a senior career advisor specializing in supply chain, logistics, and procurement careers in Kenya and East Africa. Provide personalized career advice based on the user's background and goals.
          
          Respond in JSON format with the structure:
          {
            "advice": string[],
            "skillRecommendations": string[],
            "careerPath": string[],
            "nextSteps": string[]
          }`
        },
        {
          role: 'user',
          content: `Current Role: ${request.currentRole}\nExperience: ${request.experience}\nCareer Goals: ${request.goals}\nCurrent Skills: ${request.skills.join(', ')}`
        }
      ];

      const response: OpenAIResponse = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1200,
      });

      const result = JSON.parse(response.choices[0].message.content);
      analytics.trackUserAction('ai-career-advice-success');
      
      return result;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return this.getFallbackCareerAdvice(request);
    } finally {
      performanceMonitor.endMeasure('ai-career-advice');
    }
  }

  async analyzeNews(request: NewsAnalysisRequest): Promise<NewsAnalysisResponse> {
    try {
      performanceMonitor.startMeasure('ai-news-analysis');
      
      if (!this.apiKey) {
        return this.getFallbackNewsAnalysis(request);
      }

      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are an expert analyst specializing in supply chain, logistics, and business news. Analyze the provided news article and provide insights relevant to supply chain professionals.
          
          Respond in JSON format with the structure:
          {
            "sentiment": "positive" | "negative" | "neutral",
            "categories": string[],
            "summary": string,
            "keyInsights": string[],
            "relevanceScore": number
          }`
        },
        {
          role: 'user',
          content: `Title: ${request.title}\n\nContent: ${request.content}`
        }
      ];

      const response: OpenAIResponse = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.4,
        max_tokens: 800,
      });

      const result = JSON.parse(response.choices[0].message.content);
      analytics.trackUserAction('ai-news-analysis-success', `sentiment:${result.sentiment}`);
      
      return result;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return this.getFallbackNewsAnalysis(request);
    } finally {
      performanceMonitor.endMeasure('ai-news-analysis');
    }
  }

  async generateChatResponse(message: string, context: string = ''): Promise<string> {
    try {
      performanceMonitor.startMeasure('ai-chat-response');
      
      if (!this.apiKey) {
        return this.getFallbackChatResponse(message);
      }

      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are a helpful AI assistant specializing in supply chain, logistics, and career guidance in Kenya and East Africa. Provide helpful, accurate, and contextually relevant responses. Keep responses concise but informative.${context ? ` Context: ${context}` : ''}`
        },
        {
          role: 'user',
          content: message
        }
      ];

      const response: OpenAIResponse = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const result = response.choices[0].message.content;
      analytics.trackUserAction('ai-chat-success');
      
      return result;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return this.getFallbackChatResponse(message);
    } finally {
      performanceMonitor.endMeasure('ai-chat-response');
    }
  }

  // Fallback methods for when API is not available
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

  private getFallbackCareerAdvice(request: CareerAdviceRequest): CareerAdviceResponse {
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

  private getFallbackChatResponse(message: string): string {
    const responses = [
      "I understand you're asking about supply chain topics. While I'm currently in fallback mode, I can still help with general guidance.",
      "That's an interesting question about logistics. Let me provide some general insights based on industry best practices.",
      "For career-related questions in supply chain, I'd recommend focusing on developing both technical and soft skills."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const openaiService = new OpenAIService();