import { useMemo } from 'react';
import type { PostedJob, AggregatedJob } from '@/types/jobs';

export const useJobDeduplication = (jobs: (PostedJob | AggregatedJob)[]) => {
  const deduplicatedJobs = useMemo(() => {
    const seen = new Set<string>();
    const uniqueJobs: (PostedJob | AggregatedJob)[] = [];

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
  aggregatedJobs?: AggregatedJob[]
): (PostedJob | AggregatedJob)[] => {
  const allJobs: (PostedJob | AggregatedJob)[] = [];
  
  if (postedJobs) allJobs.push(...postedJobs);
  if (aggregatedJobs) allJobs.push(...aggregatedJobs);
  
  const seen = new Set<string>();
  const uniqueJobs: (PostedJob | AggregatedJob)[] = [];

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

export const deduplicateAggregatedJobs = (jobs: AggregatedJob[]): AggregatedJob[] => {
  const seen = new Set<string>();
  const uniqueJobs: AggregatedJob[] = [];

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

// Keep old export for backwards compatibility
export const deduplicateScrapedJobs = deduplicateAggregatedJobs;
