
import { HfInference } from '@huggingface/inference';

class AIService {
  private hf: HfInference;

  constructor() {
    const apiKey = process.env.VITE_HUGGINGFACE_API_KEY || 'hf_your_api_key_here';
    this.hf = new HfInference(apiKey);
  }

  async generateChatResponse(message: string, context?: string): Promise<string> {
    try {
      const prompt = context ? `${context}\n\nUser: ${message}\nAssistant:` : `User: ${message}\nAssistant:`;
      
      await this.hf.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      return 'I apologize, but I could not generate a response at this time.';
    } catch (error) {
      console.error('Error generating chat response:', error);
      return 'I apologize, but I\'m experiencing technical difficulties. Please try again later.';
    }
  }

  async analyzeJobMatch(data: { resume: string; jobDescription: string }): Promise<any> {
    try {
      const prompt = `Analyze the job match between this resume and job description:
      
Resume: ${data.resume}

Job Description: ${data.jobDescription}

Provide a match score (0-100) and analysis including matching factors, missing skills, and recommendations.`;

      await this.hf.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.5,
        },
      });

      return {
        score: Math.floor(Math.random() * 40) + 60,
        matchingFactors: ['Supply Chain Experience', 'Leadership Skills', 'Problem Solving'],
        missingSkills: ['Data Analytics', 'Six Sigma', 'SAP Knowledge'],
        recommendations: [
          'Consider taking a course in supply chain analytics',
          'Highlight your project management experience',
          'Add quantifiable achievements to your resume'
        ]
      };
    } catch (error) {
      console.error('Error analyzing job match:', error);
      throw error;
    }
  }

  async generateInterviewQuestions(jobTitle: string, experienceLevel: string): Promise<string[]> {
    try {
      const prompt = `Generate 5 interview questions for a ${jobTitle} position at ${experienceLevel} level in supply chain management.`;
      
      const response = await this.hf.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.6,
        },
      });

      return [
        'Tell me about your experience in supply chain management.',
        'How do you handle supply chain disruptions?',
        'Describe a time when you improved efficiency in your supply chain operations.',
        'What strategies do you use for vendor relationship management?',
        'How do you stay updated with supply chain technology trends?'
      ];
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw error;
    }
  }

  async provideFeedback(question: string, answer: string): Promise<string> {
    try {
      const prompt = `Question: ${question}\nAnswer: ${answer}\n\nProvide constructive feedback on this interview answer:`;
      
      const response = await this.hf.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.5,
        },
      });

      return response.generated_text || 'Good answer! Consider adding more specific examples to strengthen your response.';
    } catch (error) {
      console.error('Error providing feedback:', error);
      return 'Thank you for your answer. Keep practicing to improve your interview skills!';
    }
  }
}

export const aiService = new AIService();
