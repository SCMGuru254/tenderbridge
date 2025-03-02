
import { PostedJob, ScrapedJob } from '@/types/jobs';

// Helper function to get company name for deduplication
export const getCompanyName = (job: PostedJob | ScrapedJob): string | null => {
  if ('companies' in job && job.companies) {
    return job.companies.name;
  }
  if ('company' in job) {
    return job.company;
  }
  return null;
};

// Process and deduplicate scraped jobs
export const deduplicateScrapedJobs = (scrapedJobs: ScrapedJob[] | undefined): ScrapedJob[] => {
  if (!scrapedJobs) return [];
  
  // Handle duplicate job detection (for jobs from multiple sources)
  const jobMap = new Map();
  
  scrapedJobs.forEach(job => {
    // Create a normalized title for better matching
    const normalizedTitle = job.title?.toLowerCase()
        .replace(/\s+/g, ' ')  // normalize whitespace
        .replace(/[^\w\s]/g, '') // remove punctuation
        .trim() || '';
    
    // Create a normalized company name
    const normalizedCompany = job.company?.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .trim() || '';
    
    // Create a composite key with more variables for better deduplication
    const key = `${normalizedTitle}:${normalizedCompany}:${job.location?.toLowerCase().trim() || ''}`;
    
    // Skip very short or generic titles that might cause false duplicates
    if (normalizedTitle.length < 5 || normalizedTitle.includes('job') || normalizedTitle.includes('position')) {
      // For very generic titles, add source to key to reduce false positives
      const keyWithSource = `${key}:${job.source || ''}`;
      
      if (!jobMap.has(keyWithSource) || new Date(job.created_at) > new Date(jobMap.get(keyWithSource).created_at)) {
        jobMap.set(keyWithSource, job);
      }
    } else {
      // For normal titles, use standard deduplication
      if (!jobMap.has(key) || new Date(job.created_at) > new Date(jobMap.get(key).created_at)) {
        jobMap.set(key, job);
      }
    }
  });
  
  return Array.from(jobMap.values());
};

// Process and combine both posted and scraped jobs with deduplication
export const combineAndDeduplicateJobs = (
  postedJobs: PostedJob[] | undefined, 
  scrapedJobs: ScrapedJob[] | undefined
): (PostedJob | ScrapedJob)[] => {
  if (!postedJobs && !scrapedJobs) return [];
  
  const allJobsMap = new Map();
  
  // Process posted jobs first (they take priority)
  if (postedJobs) {
    postedJobs.forEach(job => {
      // Create normalized strings for better matching
      const normalizedTitle = job.title?.toLowerCase()
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s]/g, '')
          .trim() || '';
          
      const normalizedCompany = getCompanyName(job)?.toLowerCase()
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s]/g, '')
          .trim() || '';
          
      const normalizedLocation = job.location?.toLowerCase()
          .replace(/\s+/g, ' ')
          .trim() || '';
      
      // Create a composite key
      const key = `${normalizedTitle}:${normalizedCompany}:${normalizedLocation}`;
      allJobsMap.set(key, job);
    });
  }
  
  // Process scraped jobs
  if (scrapedJobs) {
    scrapedJobs.forEach(job => {
      // Create normalized strings for better matching
      const normalizedTitle = job.title?.toLowerCase()
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s]/g, '')
          .trim() || '';
          
      const normalizedCompany = job.company?.toLowerCase()
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s]/g, '')
          .trim() || '';
          
      const normalizedLocation = job.location?.toLowerCase()
          .replace(/\s+/g, ' ')
          .trim() || '';
      
      // Create a composite key
      const key = `${normalizedTitle}:${normalizedCompany}:${normalizedLocation}`;
      
      // Skip very short or generic titles in deduplication
      if (normalizedTitle.length < 5) {
        // For very generic titles, add source to key to reduce false positives
        const keyWithSource = `${key}:${job.source || ''}`;
        if (!allJobsMap.has(keyWithSource)) {
          allJobsMap.set(keyWithSource, job);
        }
      } else if (!allJobsMap.has(key)) {
        // Only add if a similar job doesn't exist
        allJobsMap.set(key, job);
      }
    });
  }
  
  return Array.from(allJobsMap.values());
};
