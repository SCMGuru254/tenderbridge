
import { PostedJob, ScrapedJob, JobFilterParams } from '@/types/jobs';

export const getCompanyName = (job: PostedJob | ScrapedJob): string | null => {
  if ('companies' in job && job.companies) {
    return job.companies.name;
  }
  if ('company' in job) {
    return job.company;
  }
  return null;
};

export const getLocation = (job: PostedJob | ScrapedJob): string | null => {
  if ('companies' in job && job.companies) {
    return job.companies.location;
  }
  if ('location' in job) {
    return job.location;
  }
  return null;
};

export const getJobUrl = (job: PostedJob | ScrapedJob): string | null => {
  // For scraped jobs, use the job_url
  if ('job_url' in job) {
    return job.job_url;
  }
  // For posted jobs, no direct URL is available
  return null;
};

export const getJobSource = (job: PostedJob | ScrapedJob): string => {
  if ('source' in job && job.source) {
    return job.source;
  }
  return "Supply Chain Kenya";
};

export const filterJobs = (
  jobs: (PostedJob | ScrapedJob)[] | undefined,
  { searchTerm, category }: JobFilterParams
) => {
  if (!jobs) return [];
  
  return jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const jobType = 'job_type' in job && job.job_type ? job.job_type : null;
    const matchesCategory = !category || category === "all" || jobType === category;
    
    return matchesSearch && matchesCategory;
  });
};
