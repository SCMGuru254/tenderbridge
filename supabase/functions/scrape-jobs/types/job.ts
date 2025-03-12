
export interface Job {
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  job_url: string | null;
  application_url?: string | null;
  source: string;
  deadline?: string | null;
  salary?: string | null;
  tags?: string[] | null;
  image_url?: string | null;
}
