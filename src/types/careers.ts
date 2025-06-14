
export interface CareerRole {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  posted: string;
  isActive: boolean;
}

export interface CareerApplication {
  id: string;
  roleId?: string;
  applicant_name: string;
  applicant_email: string;
  proposal_text: string;
  user_id?: string;
  votes_count: number;
  submitted_at: string;
  status?: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
}

export interface RevenueModel {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricing: string;
  isPopular?: boolean;
}

export interface CompanyEvent {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  date?: string;
  location?: {
    type: 'online' | 'hybrid' | 'physical';
    url?: string;
    address?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  name: string;
  position?: string;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  created_at: string;
}

export interface CompanyUpdate {
  id: string;
  company_id: string;
  title: string;
  content?: string;
  type: string;
  created_at: string;
  updated_at: string;
}
