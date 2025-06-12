
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export const isValidJobData = (data: any): boolean => {
  return data && typeof data === 'object' && data.title && data.id;
};

export const extractCompanyName = (job: PostedJob | ScrapedJob): string | null => {
  const companyName = (job as any)?.company?.name || (job as any)?.company || '';
  
  if (typeof companyName === 'string' && companyName.trim()) {
    return companyName.trim();
  }
  
  return null;
};

export const extractJobLocation = (job: PostedJob | ScrapedJob): string | null => {
  const location = (job as any)?.location || '';
  
  if (typeof location === 'string' && location.trim()) {
    return location.trim();
  }
  
  return null;
};

export const formatJobType = (jobType: string | null | undefined): string => {
  if (!jobType) return 'Not specified';
  return jobType.charAt(0).toUpperCase() + jobType.slice(1).toLowerCase();
};

export const isRecentJob = (dateString: string | null | undefined, daysThreshold: number = 30): boolean => {
  if (!dateString) return false;
  
  const jobDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - jobDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= daysThreshold;
};

// Additional utility functions needed by components
export const getCompanyName = (job: PostedJob | ScrapedJob): string | null => {
  if ('company' in job && job.company) {
    return typeof job.company === 'string' ? job.company : job.company.toString();
  }
  return null;
};

export const getLocation = (job: PostedJob | ScrapedJob): string | null => {
  return job.location || null;
};

export const getJobUrl = (job: PostedJob | ScrapedJob): string | null => {
  if ('job_url' in job) {
    return job.job_url || null;
  }
  return null;
};

export const getJobSource = (job: PostedJob | ScrapedJob): string => {
  if ('source' in job && job.source) {
    return job.source;
  }
  return 'Posted Job';
};

export const getDeadline = (job: PostedJob | ScrapedJob): string | null => {
  if ('application_deadline' in job) {
    return job.application_deadline || null;
  }
  return null;
};

export const isJobExpired = (job: PostedJob | ScrapedJob): boolean => {
  const deadline = getDeadline(job);
  if (!deadline) return false;
  
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return deadlineDate < now;
};

export interface JobFilterParams {
  searchTerm?: string;
  category?: string | null;
}

export const filterJobs = (
  jobs: (PostedJob | ScrapedJob)[] | undefined,
  filters: JobFilterParams
): (PostedJob | ScrapedJob)[] => {
  if (!jobs) return [];
  
  let filtered = [...jobs];
  
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.description?.toLowerCase().includes(searchLower) ||
      job.location?.toLowerCase().includes(searchLower) ||
      getCompanyName(job)?.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.category) {
    filtered = filtered.filter(job => {
      const jobCategory = getJobSource(job);
      return jobCategory.toLowerCase().includes(filters.category!.toLowerCase());
    });
  }
  
  return filtered;
};
