
import { supabase } from '@/integrations/supabase/client';
import { CareerApplication, CareerRole } from '@/types/careers';

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

// Add the missing functions that CareerApplicationsList.tsx expects
export const fetchCareerApplications = async (): Promise<CareerApplication[]> => {
  return await careersService.getApplications();
};

export const getUserVotes = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('career_application_votes')
    .select('application_id')
    .eq('voter_id', userId);

  if (error) {
    console.error('Error fetching user votes:', error);
    return [];
  }

  return data.map(vote => vote.application_id);
};

export const voteForApplication = async (applicationId: string, voterId: string): Promise<void> => {
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('career_application_votes')
    .select('id')
    .eq('application_id', applicationId)
    .eq('voter_id', voterId)
    .single();

  if (existingVote) {
    throw new Error('You have already voted for this application');
  }

  // Add vote
  const { error: voteError } = await supabase
    .from('career_application_votes')
    .insert([{ application_id: applicationId, voter_id: voterId }]);

  if (voteError) {
    throw voteError;
  }

  // Update vote count
  const { error: updateError } = await supabase.rpc('increment_vote_count', {
    application_id: applicationId
  });

  if (updateError) {
    throw updateError;
  }
};

export const isDueDate = async (): Promise<boolean> => {
  // For now, return false. This would typically check against a configuration table
  return false;
};

export const getDueDate = async (): Promise<string | null> => {
  // For now, return null. This would typically fetch from a configuration table
  return null;
};

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
