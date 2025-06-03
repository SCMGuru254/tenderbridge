import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { PostedJob, ScrapedJob } from '@/types/jobs';
import { isJobExpired } from '@/utils/jobUtils';
import { CACHE_CONFIG } from './useAdvancedCaching';
import { usePerformanceMonitoring } from './usePerformanceMonitoring';

// High-performance job fetching optimized for 100k+ users
export const usePostedJobs = () => {
  const { trackNetworkRequest, trackError } = usePerformanceMonitoring();
  
  return useQuery<PostedJob[], PostgrestError>({
    queryKey: ['posted-jobs'],
    queryFn: async () => {
      console.log("Fetching posted jobs...");
      trackNetworkRequest();
      
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            companies (
              name,
              location,
              website,
              description
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1000); // Limit for performance

        if (error) {
          console.error("Error fetching posted jobs:", error);
          trackError(new Error(error.message));
          throw error;
        }
        
        console.log("Posted jobs:", data);
        return (data || []) as PostedJob[];
      } catch (error) {
        console.error("Failed to fetch posted jobs:", error);
        trackError(error as Error);
        return [] as PostedJob[];
      }
    },
    ...CACHE_CONFIG.JOBS,
    // Enable background refetching
    refetchInterval: CACHE_CONFIG.JOBS.refetchInterval,
    // Keep previous data while refetching
    placeholderData: (previousData) => previousData,
    // Log errors in the query observer
    meta: {
      errorHandler: (error: PostgrestError) => {
        console.error("Query error in usePostedJobs:", error);
        trackError(new Error(error.message));
      }
    }
  });
};

// Optimized scraped jobs fetching with pagination and filtering
export const useScrapedJobs = (limit: number = 1000) => {
  const { trackNetworkRequest, trackError } = usePerformanceMonitoring();
  
  return useQuery<ScrapedJob[], PostgrestError>({
    queryKey: ['scraped-jobs', limit],
    queryFn: async () => {
      console.log("Fetching scraped jobs...");
      trackNetworkRequest();
      
      try {
        const { data, error } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)
          .not('title', 'is', null)
          .not('company', 'is', null);

        if (error) {
          console.error("Error fetching scraped jobs:", error);
          trackError(new Error(error.message));
          throw error;
        }
        
        console.log("Scraped jobs:", data);
        
        // Filter out expired jobs
        const nonExpiredJobs = (data || []).filter(job => !isJobExpired(job));
        console.log(`Filtered out ${(data || []).length - nonExpiredJobs.length} expired jobs, showing ${nonExpiredJobs.length} jobs`);
        
        return nonExpiredJobs as ScrapedJob[];
      } catch (error) {
        console.error("Failed to fetch scraped jobs:", error);
        trackError(error as Error);
        return [] as ScrapedJob[];
      }
    },
    ...CACHE_CONFIG.JOBS,
    // Enable background refetching
    refetchInterval: CACHE_CONFIG.JOBS.refetchInterval,
    // Keep previous data while refetching
    placeholderData: (previousData) => previousData,
    // Log errors in the query observer
    meta: {
      errorHandler: (error: PostgrestError) => {
        console.error("Query error in useScrapedJobs:", error);
        trackError(new Error(error.message));
      }
    }
  });
};

// Optimized companies fetching
export const useCompanies = () => {
  const { trackNetworkRequest, trackError } = usePerformanceMonitoring();
  
  return useQuery<any[], PostgrestError>({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log("Fetching companies...");
      trackNetworkRequest();
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('name', { ascending: true })
          .limit(500); // Limit for performance

        if (error) {
          console.error("Error fetching companies:", error);
          trackError(new Error(error.message));
          throw error;
        }
        
        console.log("Companies:", data);
        return data || [];
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        trackError(error as Error);
        return [];
      }
    },
    ...CACHE_CONFIG.STATIC,
    // Log errors in the query observer
    meta: {
      errorHandler: (error: PostgrestError) => {
        console.error("Query error in useCompanies:", error);
        trackError(new Error(error.message));
      }
    }
  });
};
