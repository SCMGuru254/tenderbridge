
import { useMemo } from 'react';
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export const useJobDeduplication = (jobs: (PostedJob | ScrapedJob)[]) => {
  const deduplicatedJobs = useMemo(() => {
    const seen = new Set<string>();
    const uniqueJobs: (PostedJob | ScrapedJob)[] = [];

    for (const job of jobs) {
      // Safely get company name with type checking
      const company = 'company' in job && job.company ? job.company : 'unknown';
      const key = `${job.title.toLowerCase().trim()}-${company.toLowerCase().trim()}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
    }

    return uniqueJobs;
  }, [jobs]);

  return deduplicatedJobs;
};

// Export additional utility functions that are used in useJobData
export const combineAndDeduplicateJobs = (
  postedJobs?: PostedJob[], 
  scrapedJobs?: ScrapedJob[]
): (PostedJob | ScrapedJob)[] => {
  const allJobs: (PostedJob | ScrapedJob)[] = [];
  
  if (postedJobs) allJobs.push(...postedJobs);
  if (scrapedJobs) allJobs.push(...scrapedJobs);
  
  const seen = new Set<string>();
  const uniqueJobs: (PostedJob | ScrapedJob)[] = [];

  for (const job of allJobs) {
    const company = 'company' in job && job.company ? job.company : 'unknown';
    const key = `${job.title.toLowerCase().trim()}-${company.toLowerCase().trim()}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }

  return uniqueJobs;
};

export const deduplicateScrapedJobs = (jobs: ScrapedJob[]): ScrapedJob[] => {
  const seen = new Set<string>();
  const uniqueJobs: ScrapedJob[] = [];

  for (const job of jobs) {
    const company = job.company || 'unknown';
    const key = `${job.title.toLowerCase().trim()}-${company.toLowerCase().trim()}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }

  return uniqueJobs;
};
