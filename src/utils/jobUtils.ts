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
  if ('job_url' in job && job.job_url) {
    return job.job_url as string;
  }
  // For scraped jobs, fall back to application_url if job_url is not available
  if ('application_url' in job && job.application_url) {
    return job.application_url as string;
  }
  // For posted jobs with ID, create a link to the job details page
  if (job.id) {
    return `/jobs/details/${job.id}`;
  }
  // Return null if no URL is available
  return null;
};

export const hasExternalUrl = (job: PostedJob | ScrapedJob): boolean => {
  const url = getJobUrl(job);
  if (!url) return false;
  return url.startsWith('http');
};

export const getJobSource = (job: PostedJob | ScrapedJob): string => {
  // For posted jobs (directly posted on our platform)
  if ('companies' in job) {
    return "Supply Chain Kenya";
  }
  
  // For scraped jobs with source information
  if ('source' in job && job.source) {
    // Normalize the source string
    const source = job.source.toLowerCase().trim();
    
    // Match against known job sites with more specific checks
    if (source.includes('linkedin')) {
      return 'LinkedIn';
    } else if (source.includes('brightermonday') || source.includes('brighter_monday') || source.includes('brighter-monday')) {
      return 'BrighterMonday';
    } else if (source.includes('fuzu')) {
      return 'Fuzu';
    } else if (source.includes('myjobmag') || source.includes('my_job_mag') || source.includes('my-job-mag')) {
      return 'MyJobMag';
    } else if (source.includes('jobwebkenya') || source.includes('jobweb_kenya') || source.includes('jobweb') || source.includes('job-web')) {
      return 'JobWebKenya';
    } else if (source.includes('indeed')) {
      return 'Indeed';
    } else if (source.includes('google')) {
      return 'Google Jobs';
    } else if (source.includes('pigiame') || source.includes('pigia-me')) {
      return 'PigiaMe';
    } else if (source.includes('ajira') || source.includes('ajira-digital')) {
      return 'Ajira Digital';
    } else if (source.includes('kazi')) {
      return 'KaziRemote';
    } else {
      // Format the source name by capitalizing first letter of each word
      return source.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }
  
  // Default source if none is specified
  return "Supply Chain Kenya";
};

export const getJobType = (job: PostedJob | ScrapedJob): string => {
  return job.job_type?.toString() || "full_time";
};

export const getDeadline = (job: PostedJob | ScrapedJob): string | null => {
  if ('application_deadline' in job && job.application_deadline) {
    return job.application_deadline;
  }
  return null;
};

export const getRemainingTime = (job: PostedJob | ScrapedJob): string | null => {
  // For scraped jobs with application_deadline
  if ('application_deadline' in job && job.application_deadline) {
    const deadline = new Date(job.application_deadline);
    if (!isNaN(deadline.getTime())) {
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return "Expired";
      } else if (diffDays === 0) {
        // Calculate hours if less than a day
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        if (diffHours <= 0) {
          return "Closing today";
        } else {
          return `${diffHours} hours left`;
        }
      } else if (diffDays === 1) {
        return "1 day left";
      } else if (diffDays <= 7) {
        return `${diffDays} days left`;
      } else {
        return `${diffDays} days left`;
      }
    }
  }
  return null;
};

export const isJobExpired = (job: PostedJob | ScrapedJob): boolean => {
  // For scraped jobs with application_deadline
  if ('application_deadline' in job && job.application_deadline) {
    const deadline = new Date(job.application_deadline);
    if (!isNaN(deadline.getTime()) && deadline < new Date()) {
      return true;
    }
  }
  
  // Consider a scraped job expired if it's more than 30 days old
  if ('created_at' in job) {
    const createdAt = new Date(job.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (createdAt < thirtyDaysAgo) {
      return true;
    }
  }
  
  return false;
};

export const filterJobs = (
  jobs: (PostedJob | ScrapedJob)[] | undefined,
  { searchTerm, category }: JobFilterParams
) => {
  if (!jobs) return [];
  
  return jobs.filter(job => {
    // Filter out expired jobs
    if (isJobExpired(job)) {
      return false;
    }
    
    // Search in title, description, company name, and location
    const jobCompany = getCompanyName(job) || '';
    const jobLocation = getLocation(job) || '';
    const jobDescription = job.description || '';
    
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle job type filtering, accounting for both enum and string values
    const jobType = getJobType(job);
    const matchesCategory = !category || category === "all" || jobType === category;
    
    return matchesSearch && matchesCategory;
  });
};

export const getSafeArray = (data: unknown): string[] => {
  if (Array.isArray(data)) {
    return data.map(item => String(item));
  }
  return [];
};

export const getSocialDescription = (job: PostedJob | ScrapedJob): string => {
  const company = getCompanyName(job) || 'Company';
  const location = getLocation(job) || 'Kenya';
  const jobType = getJobType(job);
  
  return `${job.title} - ${company} in ${location} (${jobType})`;
};
