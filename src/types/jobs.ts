export type PostedJob = {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  created_at: string;
  company_id?: string;
  is_active?: boolean;
  posted_by?: string;
  updated_at?: string;
  skills?: string[] | null;
  requirements?: string[] | null;
  responsibilities?: string[] | null;
  salary_range?: string | null;
  application_deadline?: string | null;
  companies?: {
    name: string | null;
    location: string | null;
  } | null;
}

export type ScrapedJob = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  description: string | null;
  job_type: string | null;
  source: string | null;
  job_url: string | null;
  application_url: string | null;
  created_at: string;
  updated_at?: string;
  employment_type?: string | null;
  experience_level?: string | null;
  category?: string | null;
  application_deadline: string | null;
  skills?: string[] | null;
  requirements?: string[] | null;
  responsibilities?: string[] | null;
  salary_range?: string | null;
  social_shares?: {
    count: number;
  } | null;
}

export type JobType = {
  company?: string;
  job_url?: string;
  category?: string;
  social_shares?: {
    count: number;
  } | null;
} & (PostedJob | ScrapedJob);

export type JobFilterParams = {
  searchTerm: string;
  category: string | null;
}
