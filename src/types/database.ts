export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  headline?: string;
  location?: string;
  phone?: string;
  email: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  visibility_setting: 'public' | 'private' | 'connections_only';
  email_visible: boolean;
  phone_visible: boolean;
  social_links_visible: boolean;
  roles?: UserRole[];
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'employer' | 'job_seeker' | 'instructor';
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  company_size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1001-5000' | '5000+';
  headquarters?: string;
  founded_year?: number;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  company_name?: string;
  posted_by?: string;
  title: string;
  description: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary';
  location: string;
  is_remote: boolean;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  experience_level?: 'entry' | 'intermediate' | 'senior' | 'lead' | 'executive';
  education_level?: string;
  status: 'draft' | 'published' | 'closed' | 'archived';
  application_deadline?: string;
  job_skills?: JobSkill[];
  created_at: string;
  updated_at: string;
}

export interface JobSkill {
  id: string;
  job_id: string;
  skill_name: string;
  skill_level?: string;
  is_required: boolean;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  resume_url: string;
  cover_letter_url?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'withdrawn';
  application_date: string;
  last_updated: string;
}

export interface DocumentUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  document_type: 'resume' | 'cover_letter' | 'certificate' | 'portfolio' | 'other';
  is_current: boolean;
  uploaded_at: string;
}