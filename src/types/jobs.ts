
export interface BaseJob {
  id: string;
  title: string;
  job_type?: string;
  created_at: string;
  skills?: string[];
  tags?: string[];
  is_remote?: boolean;
  experience_level?: string;
  social_shares?: Record<string, string | number>;
}

export interface PostedJob extends BaseJob {
  description: string;
  location: string;
  posted_by: string;
  company_id?: string;
  salary_range?: string;
  requirements?: string[];
  responsibilities?: string[];
  is_active?: boolean;
  updated_at: string;
  hiring_timeline?: string;
}

export interface AggregatedJob extends BaseJob {
  company?: string;
  location?: string;
  description?: string;
  source?: string;
  job_url?: string;
  application_url?: string;
  application_deadline?: string;
  category?: string;
  salary_range?: string;
  employment_type?: string;
  experience_level?: string;
  skills?: string[];
  is_scam?: boolean;
  scam_reports?: number;
  updated_at: string;
  source_posted_at?: string;
}

export type Job = PostedJob | AggregatedJob;

// Add the missing JobType for compatibility
export type JobType = PostedJob | AggregatedJob;

export interface JobFilterParams {
  searchTerm?: string;
  category?: string;
}
