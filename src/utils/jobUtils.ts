
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export const formatSalary = (job: PostedJob | ScrapedJob): string | null => {
  if ('salary_range' in job && job.salary_range) {
    return job.salary_range;
  }
  return null;
};

export const getJobCompany = (job: PostedJob | ScrapedJob): string | null => {
  if ('company' in job && job.company) {
    return job.company;
  }
  if ('posted_by' in job && job.posted_by) {
    return job.posted_by;
  }
  return 'Company not specified';
};

// Alias for backward compatibility
export const getCompanyName = getJobCompany;

export const getJobLocation = (job: PostedJob | ScrapedJob): string | null => {
  if (job.location) {
    return job.location;
  }
  return 'Location not specified';
};

// Alias for backward compatibility
export const getLocation = getJobLocation;

export const getJobUrl = (job: PostedJob | ScrapedJob): string | null => {
  if ('job_url' in job && job.job_url) {
    return job.job_url;
  }
  if ('application_url' in job && job.application_url) {
    return job.application_url;
  }
  return null;
};

export const isScrapedJob = (job: PostedJob | ScrapedJob): job is ScrapedJob => {
  return 'source' in job;
};

export const formatJobType = (jobType: string | undefined): string => {
  if (!jobType) return 'Not specified';
  return jobType.charAt(0).toUpperCase() + jobType.slice(1);
};

export const getJobDeadline = (job: PostedJob | ScrapedJob): string | null => {
  if ('application_deadline' in job && job.application_deadline) {
    return job.application_deadline;
  }
  return null;
};

// Alias for backward compatibility
export const getDeadline = getJobDeadline;

export const getJobSource = (job: PostedJob | ScrapedJob): string => {
  if (isScrapedJob(job) && job.source) {
    return job.source;
  }
  if ('posted_by' in job) {
    return 'Posted Job';
  }
  return 'Unknown';
};

export const isJobExpired = (job: PostedJob | ScrapedJob): boolean => {
  const deadline = getJobDeadline(job);
  if (!deadline) return false;
  
  try {
    const deadlineDate = new Date(deadline);
    return deadlineDate < new Date();
  } catch {
    return false;
  }
};

export const filterJobs = (
  jobs: (PostedJob | ScrapedJob)[] | undefined,
  filters: { searchTerm?: string; category?: string | null }
): (PostedJob | ScrapedJob)[] => {
  if (!jobs) return [];
  
  return jobs.filter(job => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesTitle = job.title.toLowerCase().includes(searchLower);
      const matchesCompany = getCompanyName(job)?.toLowerCase().includes(searchLower) || false;
      const matchesLocation = getLocation(job)?.toLowerCase().includes(searchLower) || false;
      
      if (!matchesTitle && !matchesCompany && !matchesLocation) {
        return false;
      }
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (job.job_type !== filters.category) {
        return false;
      }
    }
    
    return true;
  });
};
