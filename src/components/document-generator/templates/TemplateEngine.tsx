import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Template {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  style: {
    layout: string;
    sections: string[];
  };
}

export const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design perfect for supply chain roles',
    isPremium: false,
    style: {
      layout: 'modern-layout',
      sections: ['header', 'experience', 'education', 'skills']
    }
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior management positions',
    isPremium: true,
    style: {
      layout: 'executive-layout',
      sections: ['summary', 'achievements', 'experience', 'education']
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple, ATS-friendly format that highlights content',
    isPremium: false,
    style: {
      layout: 'minimal-layout',
      sections: ['contact', 'experience', 'skills', 'education']
    }
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Distinctive design for innovative supply chain roles',
    isPremium: true,
    style: {
      layout: 'creative-layout',
      sections: ['profile', 'expertise', 'projects', 'education']
    }
  },
  {
    id: 'functional',
    name: 'Functional Resume',
    description: 'Skills-focused format for career changers',
    isPremium: false,
    style: {
      layout: 'functional-layout',
      sections: ['skills', 'achievements', 'experience']
    }
  },
  {
    id: 'ats-optimized',
    name: 'ATS-Friendly',
    description: 'Maximized for applicant tracking systems',
    isPremium: false,
    style: {
      layout: 'ats-layout',
      sections: ['contact', 'experience', 'skills', 'education']
    }
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Specialist',
    description: 'Tailored for logistics and SCM roles',
    isPremium: true,
    style: {
      layout: 'supply-chain-layout',
      sections: ['metrics', 'achievements', 'experience', 'certifications']
    }
  }
];

export const useTemplateEngine = () => {
  const { toast } = useToast();

  const generateDocument = useCallback(async (
    templateId: string,
    data: Record<string, any>
  ) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const { data: result, error } = await supabase.functions.invoke('document-generator', {
        body: {
          templateId,
          data,
          style: template.style
        }
      });

      if (error) throw error;
      return result.documentUrl;
    } catch (error) {
      console.error('Document generation error:', error);
      toast({
        title: 'Generation failed',
        description: 'Unable to generate document. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  }, [toast]);

  return { templates, generateDocument };
};
