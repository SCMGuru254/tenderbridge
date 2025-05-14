
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { PostedJob, ScrapedJob } from '@/types/jobs';
import { isJobExpired } from '@/utils/jobUtils';

// Fetch posted jobs from the database with improved error handling
export const usePostedJobs = () => {
  return useQuery<PostedJob[], PostgrestError>({
    queryKey: ['posted-jobs'],
    queryFn: async () => {
      console.log("Fetching posted jobs...");
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
          .eq('is_active', true);

        if (error) {
          console.error("Error fetching posted jobs:", error);
          throw error;
        }
        console.log("Posted jobs:", data);
        return (data || []) as PostedJob[];
      } catch (error) {
        console.error("Failed to fetch posted jobs:", error);
        // Return empty array instead of throwing to prevent UI from breaking
        return [] as PostedJob[];
      }
    },
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    gcTime: 1000 * 60 * 60, // Keep cached data for 1 hour
    // Using the new API for error handling
    networkMode: 'always',
    // Log errors in the query observer
    meta: {
      errorHandler: (error: PostgrestError) => {
        console.error("Query error in usePostedJobs:", error);
      }
    }
  });
};

// Fetch scraped jobs from the database with duplicate and expired job filtering and improved error handling
export const useScrapedJobs = () => {
  return useQuery<ScrapedJob[], PostgrestError>({
    queryKey: ['scraped-jobs'],
    queryFn: async () => {
      console.log("Fetching scraped jobs...");
      try {
        const { data, error } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching scraped jobs:", error);
          throw error;
        }
        
        console.log("Scraped jobs:", data);
        
        // Filter out any obviously expired jobs
        const nonExpiredJobs = (data || []).filter(job => !isJobExpired(job));
        console.log(`Filtered out ${(data || []).length - nonExpiredJobs.length} expired jobs, showing ${nonExpiredJobs.length} jobs`);
        
        return nonExpiredJobs as ScrapedJob[];
      } catch (error) {
        console.error("Failed to fetch scraped jobs:", error);
        // Return empty array instead of throwing to prevent UI from breaking
        return [] as ScrapedJob[];
      }
    },
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    gcTime: 1000 * 60 * 60, // Keep cached data for 1 hour
    // Using the new API for error handling
    networkMode: 'always',
    // Log errors in the query observer
    meta: {
      errorHandler: (error: PostgrestError) => {
        console.error("Query error in useScrapedJobs:", error);
      }
    }
  });
};

// Fetch companies with improved error handling
export const useCompanies = () => {
  return useQuery<any[], PostgrestError>({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log("Fetching companies...");
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*');

        if (error) {
          console.error("Error fetching companies:", error);
          throw error;
        }
        
        console.log("Companies:", data);
        return data || [];
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        // Return empty array instead of throwing to prevent UI from breaking
        return [];
      }
    },
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    gcTime: 1000 * 60 * 60, // Keep cached data for 1 hour
    // Using the new API for error handling
    networkMode: 'always',
    // Log errors in the query observer
    meta: {
      errorHandler: (error: PostgrestError) => {
        console.error("Query error in useCompanies:", error);
      }
    }
  });
};
