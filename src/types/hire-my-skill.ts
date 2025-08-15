export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ProjectStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type ContractStatus = 'draft' | 'signed' | 'active' | 'completed' | 'terminated';

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  title: string;
  summary?: string;
  hourly_rate?: number;
  availability?: string;
  experience_years?: number;
  education?: string;
  certifications?: string[];
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  skills?: ProfessionalSkill[];
}

export interface ProfessionalSkill {
  id: string;
  profile_id: string;
  skill_id: string;
  skill?: Skill;
  proficiency_level: ProficiencyLevel;
  years_experience?: number;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  duration_estimate?: string;
  requirements?: string[];
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  required_skills?: ProjectSkill[];
  client?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface ProjectSkill {
  id: string;
  project_id: string;
  skill_id: string;
  skill?: Skill;
  minimum_proficiency: ProficiencyLevel;
  created_at: string;
}

export interface ProjectProposal {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string;
  proposed_rate: number;
  estimated_hours?: number;
  availability_start?: string;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
  professional?: ProfessionalProfile;
  project?: Project;
}

export interface ProjectContract {
  id: string;
  project_id: string;
  proposal_id: string;
  professional_id: string;
  client_id: string;
  start_date: string;
  end_date?: string;
  agreed_rate: number;
  payment_terms?: string;
  status: ContractStatus;
  created_at: string;
  updated_at: string;
  project?: Project;
  proposal?: ProjectProposal;
  professional?: ProfessionalProfile;
  client?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface ProjectReview {
  id: string;
  contract_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  review_text?: string;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  created_at: string;
  reviewer?: {
    full_name?: string;
    avatar_url?: string;
  };
  reviewee?: {
    full_name?: string;
    avatar_url?: string;
  };
}
