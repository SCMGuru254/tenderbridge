import { supabase } from '../lib/supabaseClient';
import type { 
  Skill, 
  ProfessionalProfile,
  Project,
  ProjectProposal,
  ProjectContract,
  ProjectReview
} from '../types/hire-my-skill';

export class HireMySkillService {
  // Skills
  static async listSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async getSkillById(id: string): Promise<Skill | null> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Professional Profiles
  static async getProfessionalProfile(userId: string): Promise<ProfessionalProfile | null> {
    const { data, error } = await supabase
      .from('professional_profiles')
      .select(`
        *,
        skills:professional_skills(
          *,
          skill:skills(*)
        )
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProfessionalProfile(userId: string, profile: Partial<ProfessionalProfile>): Promise<ProfessionalProfile> {
    const { data, error } = await supabase
      .from('professional_profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Projects
  static async listProjects(filters?: {
    status?: string[],
    skillIds?: string[],
    clientId?: string
  }): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select(`
        *,
        required_skills:project_skills(
          *,
          skill:skills(*)
        ),
        client:profiles!client_id(
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.in('status', filters.status);
    }
    
    if (filters?.skillIds) {
      query = query.in('required_skills.skill_id', filters.skillIds);
    }

    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        required_skills:project_skills(
          *,
          skill:skills(*)
        ),
        client:profiles!client_id(
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createProject(project: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Proposals
  static async listProjectProposals(projectId: string): Promise<ProjectProposal[]> {
    const { data, error } = await supabase
      .from('project_proposals')
      .select(`
        *,
        professional:professional_profiles(*),
        project:projects(*)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getProfessionalProposals(professionalId: string): Promise<ProjectProposal[]> {
    const { data, error } = await supabase
      .from('project_proposals')
      .select(`
        *,
        project:projects(
          *,
          client:profiles!client_id(
            full_name,
            avatar_url
          )
        )
      `)
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async submitProposal(proposal: Partial<ProjectProposal>): Promise<ProjectProposal> {
    const { data, error } = await supabase
      .from('project_proposals')
      .insert(proposal)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Contracts
  static async listContracts(filters: {
    professionalId?: string,
    clientId?: string,
    status?: string[]
  }): Promise<ProjectContract[]> {
    let query = supabase
      .from('project_contracts')
      .select(`
        *,
        project:projects(*),
        proposal:project_proposals(*),
        professional:professional_profiles(*),
        client:profiles!client_id(
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.professionalId) {
      query = query.eq('professional_id', filters.professionalId);
    }

    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters.status) {
      query = query.in('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getContractById(id: string): Promise<ProjectContract | null> {
    const { data, error } = await supabase
      .from('project_contracts')
      .select(`
        *,
        project:projects(*),
        proposal:project_proposals(*),
        professional:professional_profiles(*),
        client:profiles!client_id(
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Reviews
  static async createReview(review: Partial<ProjectReview>): Promise<ProjectReview> {
    const { data, error } = await supabase
      .from('project_reviews')
      .insert(review)
      .select(`
        *,
        reviewer:profiles!reviewer_id(
          full_name,
          avatar_url
        ),
        reviewee:profiles!reviewee_id(
          full_name,
          avatar_url
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getReviewsForUser(userId: string): Promise<ProjectReview[]> {
    const { data, error } = await supabase
      .from('project_reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(
          full_name,
          avatar_url
        ),
        reviewee:profiles!reviewee_id(
          full_name,
          avatar_url
        )
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}
