import type { PostedJob, AggregatedJob } from '@/types/jobs';

export const formatSalary = (job: PostedJob | AggregatedJob): string | null => {
  if ('salary_range' in job && job.salary_range) {
    return job.salary_range;
  }
  return null;
};

export const getJobCompany = (job: PostedJob | AggregatedJob): string | null => {
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

export const getJobLocation = (job: PostedJob | AggregatedJob): string | null => {
  if (job.location && job.location.trim() !== '') {
    return job.location.trim();
  }
  return 'Location not specified';
};

// Alias for backward compatibility
export const getLocation = getJobLocation;

export const getJobUrl = (job: PostedJob | AggregatedJob): string | null => {
  if ('job_url' in job && job.job_url && job.job_url.trim() !== '') {
    return job.job_url.trim();
  }
  if ('application_url' in job && job.application_url && job.application_url.trim() !== '') {
    return job.application_url.trim();
  }
  return null;
};

export const isAggregatedJob = (job: PostedJob | AggregatedJob): job is AggregatedJob => {
  return 'source' in job;
};

// Keep old function for backwards compatibility
export const isScrapedJob = isAggregatedJob;

export const formatJobType = (jobType: string | undefined): string => {
  if (!jobType || jobType.trim() === '') return 'Not specified';
  return jobType.charAt(0).toUpperCase() + jobType.slice(1);
};

export const getJobDeadline = (job: PostedJob | AggregatedJob): string | null => {
  if ('application_deadline' in job && job.application_deadline) {
    return job.application_deadline;
  }
  return null;
};

// Alias for backward compatibility
export const getDeadline = getJobDeadline;

export const getJobSource = (job: PostedJob | AggregatedJob): string => {
  if (isAggregatedJob(job) && job.source && job.source.trim() !== '') {
    return job.source.trim();
  }
  if ('posted_by' in job) {
    return 'Posted Job';
  }
  return 'Unknown Source';
};

export const isJobExpired = (job: PostedJob | AggregatedJob): boolean => {
  const deadline = getJobDeadline(job);
  if (!deadline) return false;
  
  try {
    const deadlineDate = new Date(deadline);
    return deadlineDate < new Date();
  } catch {
    return false;
  }
};

// Function to check if a job was posted within the last 7 days (more permissive)
export const isJobPostedWithinWeek = (job: PostedJob | AggregatedJob): boolean => {
  try {
    // Use source_posted_at if available, otherwise fallback to created_at
    const dateToCheck = 'source_posted_at' in job && job.source_posted_at 
      ? job.source_posted_at 
      : job.created_at;
    
    if (!dateToCheck || typeof dateToCheck !== 'string') {
      console.log('🚫 No valid date found for job:', job.title);
      return true; // Include jobs without dates rather than exclude them
    }
    
    const jobCreatedAt = new Date(dateToCheck);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const isRecent = jobCreatedAt >= sevenDaysAgo;
    console.log(`🔍 Job "${job.title}" posted at:`, jobCreatedAt.toISOString(), 
                'vs 7 days ago:', sevenDaysAgo.toISOString(), 
                'is recent:', isRecent);
    
    return isRecent;
  } catch (error) {
    console.error('Error checking if job is within 7 days:', error);
    return true; // Include jobs with errors rather than exclude them
  }
};

// Keep old function for backwards compatibility but make it more permissive
export const isJobPostedWithin24Hours = (job: PostedJob | AggregatedJob): boolean => {
  return isJobPostedWithinWeek(job);
};

// Function to get human-readable time since posting
export const getTimeSincePosted = (job: PostedJob | AggregatedJob): string => {
  try {
    // Use source_posted_at if available, otherwise fallback to created_at
    const dateToUse = 'source_posted_at' in job && job.source_posted_at 
      ? job.source_posted_at 
      : job.created_at;
    
    if (!dateToUse || typeof dateToUse !== 'string') {
      return 'Recently posted';
    }
    
    const baseDate = new Date(dateToUse);
    const now = new Date();
    const diffInMs = now.getTime() - baseDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInHours < 1) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  } catch (error) {
    console.error('Error calculating time since posted:', error);
    return 'Recently posted';
  }
};

export const filterJobs = (
  jobs: (PostedJob | AggregatedJob)[] | undefined,
  filters: { searchTerm?: string; category?: string | null; onlyRecent?: boolean }
): (PostedJob | AggregatedJob)[] => {
  if (!jobs) {
    console.log("filterJobs - No jobs provided");
    return [];
  }
  
  console.log("filterJobs - Input jobs:", jobs.length);
  console.log("filterJobs - Filters:", filters);
  
  const filtered = jobs.filter(job => {
    // Filter for jobs posted within a week if onlyRecent is true
    if (filters.onlyRecent && !isJobPostedWithinWeek(job)) {
      return false;
    }
    
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
