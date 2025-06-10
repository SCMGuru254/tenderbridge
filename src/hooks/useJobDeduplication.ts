
import { useMemo } from 'react';
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export const useJobDeduplication = (jobs: (PostedJob | ScrapedJob)[]) => {
  const deduplicatedJobs = useMemo(() => {
    const seen = new Set<string>();
    const uniqueJobs: (PostedJob | ScrapedJob)[] = [];

    for (const job of jobs) {
      const key = `${job.title.toLowerCase().trim()}-${(job.company || 'unknown').toLowerCase().trim()}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
    }

    return uniqueJobs;
  }, [jobs]);

  return deduplicatedJobs;
};
