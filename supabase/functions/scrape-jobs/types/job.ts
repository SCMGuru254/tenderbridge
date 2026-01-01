export interface Job {
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  job_url: string | null;
  application_url?: string | null;
  source: string;
  source_posted_at?: string | null;
  deadline?: string | null;
  salary?: string | null;
  tags?: string[] | null;
  image_url?: string | null;
  experience_level?: string | null;
  skills?: string[] | null;
  employment_type?: string | null;
  education_requirements?: string | null;
  benefits?: string[] | null;
  is_remote?: boolean;
  application_instructions?: string | null;
  company_website?: string | null;
  company_description?: string | null;
  created_at?: string;
  updated_at?: string;
}
