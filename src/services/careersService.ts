
import { supabase } from '@/integrations/supabase/client';
import { CareerRole, CareerApplication } from '@/types/careers';

export const careersService = {
  async getRoles(): Promise<CareerRole[]> {
    const { data, error } = await supabase
      .from('career_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching career roles:', error);
      return [];
    }

    return data || [];
  },

  async createApplication(application: Omit<CareerApplication, 'id' | 'created_at'>): Promise<CareerApplication | null> {
    const { data, error } = await supabase
      .from('career_applications')
      .insert([application])
      .select()
      .single();

    if (error) {
      console.error('Error creating career application:', error);
      return null;
    }

    return data;
  },

  async getApplications(): Promise<CareerApplication[]> {
    const { data, error } = await supabase
      .from('career_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching career applications:', error);
      return [];
    }

    return data || [];
  }
};

// Add the missing submitCareerApplication function
export const submitCareerApplication = async (
  applicantName: string,
  applicantEmail: string,
  proposalText: string,
  userId?: string
): Promise<CareerApplication | null> => {
  const applicationData = {
    applicant_name: applicantName,
    applicant_email: applicantEmail,
    proposal_text: proposalText,
    user_id: userId,
    votes_count: 0,
    submitted_at: new Date().toISOString()
  };

  return await careersService.createApplication(applicationData);
};
