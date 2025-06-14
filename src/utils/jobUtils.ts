
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export const formatSalary = (job: PostedJob | ScrapedJob): string | null => {
  if ('salary_range' in job && job.salary_range) {
    return job.salary_range;
  }
  return null;
};

export const getJobCompany = (job: PostedJob | ScrapedJob): string | null => {
  if ('company' in job && job.company && job.company.trim() !== '') {
    return job.company.trim();
  }
  if ('posted_by' in job && job.posted_by && job.posted_by.trim() !== '') {
    return job.posted_by.trim();
  }
  return 'Company not specified';
};

// Alias for backward compatibility
export const getCompanyName = getJobCompany;

export const getJobLocation = (job: PostedJob | ScrapedJob): string | null => {
  if (job.location && job.location.trim() !== '') {
    return job.location.trim();
  }
  return 'Location not specified';
};

// Alias for backward compatibility
export const getLocation = getJobLocation;

export const getJobUrl = (job: PostedJob | ScrapedJob): string | null => {
  if ('job_url' in job && job.job_url && job.job_url.trim() !== '') {
    return job.job_url.trim();
  }
  if ('application_url' in job && job.application_url && job.application_url.trim() !== '') {
    return job.application_url.trim();
  }
  return null;
};

export const isScrapedJob = (job: PostedJob | ScrapedJob): job is ScrapedJob => {
  return 'source' in job;
};

export const formatJobType = (jobType: string | undefined): string => {
  if (!jobType || jobType.trim() === '') return 'Not specified';
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
  if (isScrapedJob(job) && job.source && job.source.trim() !== '') {
    return job.source.trim();
  }
  if ('posted_by' in job) {
    return 'Posted Job';
  }
  return 'Unknown Source';
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
  if (!jobs) {
    console.log("filterJobs - No jobs provided");
    return [];
  }
  
  console.log("filterJobs - Input jobs:", jobs.length);
  console.log("filterJobs - Filters:", filters);
  
  const filtered = jobs.filter(job => {
    // Search term filter
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesTitle = job.title && job.title.toLowerCase().includes(searchLower);
      const matchesCompany = getCompanyName(job)?.toLowerCase().includes(searchLower) || false;
      const matchesLocation = getLocation(job)?.toLowerCase().includes(searchLower) || false;
      
      if (!matchesTitle && !matchesCompany && !matchesLocation) {
        return false;
      }
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all' && filters.category !== null) {
      if (job.job_type !== filters.category) {
        return false;
      }
    }
    
    return true;
  });
  
  console.log("filterJobs - Filtered jobs:", filtered.length);
  return filtered;
};
