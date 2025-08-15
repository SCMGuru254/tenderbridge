import { supabase } from '@/lib/supabaseClient';
import type { ResumeAnalysis } from '@/types/ai';

class AIService {
  async analyzeResume(file: File): Promise<ResumeAnalysis> {
    try {
      // Upload file to Supabase storage
      const fileName = `resumes/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get file URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Simulated AI analysis response
      const analysis: ResumeAnalysis = {
        skills: [
          'Supply Chain Management',
          'Inventory Management',
          'Process Optimization'
        ],
        experienceLevel: 'Senior Level',
        industryMatches: [
          { industry: 'Supply Chain', score: 85 },
          { industry: 'Logistics', score: 75 }
        ],
        recommendations: [
          'Consider pursuing APICS certification',
          'Add more quantitative achievements'
        ]
      };

      // Clean up - delete uploaded file
      await supabase.storage
        .from('documents')
        .remove([fileName]);

      return analysis;
    } catch (error) {
      console.error('Error in analyzeResume:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
