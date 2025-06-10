
import { QueryClient } from '@tanstack/react-query';

// Cache configuration for different data types
export const CACHE_CONFIG = {
  JOBS: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  STATIC: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
  },
  USER_DATA: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  }
};

// Create optimized query client
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_CONFIG.JOBS.staleTime,
        gcTime: CACHE_CONFIG.JOBS.gcTime,
        refetchOnWindowFocus: false,
        retry: CACHE_CONFIG.JOBS.retry,
        retryDelay: CACHE_CONFIG.JOBS.retryDelay,
      },
    },
  });
};
