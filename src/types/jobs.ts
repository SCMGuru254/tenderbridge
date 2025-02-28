
export type PostedJob = {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
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
}

export type JobType = PostedJob | ScrapedJob;

export type JobFilterParams = {
  searchTerm: string;
  category: string | null;
}
