import { supabase } from '@/integrations/supabase/client';
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
  // const { data: { publicUrl } } = supabase.storage
  //   .from('documents')
  //   .getPublicUrl(fileName);

      // Call Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('ats-checker', {
        body: { filePath: fileName }
      });

      if (functionError) throw functionError;

      // Map backend response to Frontend type
      const analysis: ResumeAnalysis = {
        skills: data.foundKeywords || [], 
        experienceLevel: data.score?.overall > 80 ? 'Senior Level' : data.score?.overall > 50 ? 'Mid Level' : 'Entry Level',
        industryMatches: [
          { industry: 'Supply Chain Compatibility', score: data.score?.overall || 0 },
          { industry: 'ATS Parseability', score: data.score?.readability || 0 }
        ],
        recommendations: [
          ...(data.suggestions || []),
          ...(data.issues || []),
          ...(data.missingKeywords ? [`Missing keywords: ${data.missingKeywords ? data.missingKeywords.join(', ') : ''}`] : [])
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
