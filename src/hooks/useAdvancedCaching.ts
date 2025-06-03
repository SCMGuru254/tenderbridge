
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Advanced caching configuration for high-scale applications
export const CACHE_CONFIG = {
  // Job data caching - critical for performance with 100k+ users
  JOBS: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchInterval: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000)
  },
  
  // User data caching - less frequent updates
  USER: {
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    retryDelay: 1000
  },
  
  // Static data caching - very long cache times
  STATIC: {
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1
  }
};

export function useAdvancedCaching() {
  const queryClient = useQueryClient();

  // Prefetch commonly accessed data
  const prefetchJobData = useCallback(async () => {
    await queryClient.prefetchQuery({
      queryKey: ['posted-jobs'],
      staleTime: CACHE_CONFIG.JOBS.staleTime,
    });
    
    await queryClient.prefetchQuery({
      queryKey: ['scraped-jobs'],
      staleTime: CACHE_CONFIG.JOBS.staleTime,
    });
  }, [queryClient]);

  // Invalidate stale data strategically
  const invalidateJobData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['posted-jobs'] });
    queryClient.invalidateQueries({ queryKey: ['scraped-jobs'] });
  }, [queryClient]);

  // Batch invalidations for better performance
  const batchInvalidate = useCallback((keys: string[][]) => {
    keys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  }, [queryClient]);

  return {
    prefetchJobData,
    invalidateJobData,
    batchInvalidate,
    queryClient
  };
}
