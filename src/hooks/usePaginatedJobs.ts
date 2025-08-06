import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PaginatedJobsParams {
  limit?: number;
  offset?: number;
  searchTerm?: string;
  location?: string;
  jobType?: string;
}

interface JobResult {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  job_type: string;
  created_at: string;
  total_count: number;
}

export const usePaginatedJobs = (params: PaginatedJobsParams = {}) => {
  const {
    limit = 20,
    offset = 0,
    searchTerm = null,
    location = null,
    jobType = null
  } = params;

  return useQuery({
    queryKey: ['paginated-jobs', limit, offset, searchTerm, location, jobType],
    queryFn: async (): Promise<{ jobs: JobResult[]; totalCount: number }> => {
      const { data, error } = await supabase.rpc('get_paginated_jobs', {
        p_limit: limit,
        p_offset: offset,
        p_search_term: searchTerm,
        p_location: location,
        p_job_type: jobType
      });

      if (error) {
        console.error('Error fetching paginated jobs:', error);
        throw error;
      }

      const jobs = data || [];
      const totalCount = jobs.length > 0 ? jobs[0].total_count : 0;

      return {
        jobs,
        totalCount
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};