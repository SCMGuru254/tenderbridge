
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
      console.log("🔍 usePostedJobs - Starting fetch...");
      trackNetworkRequest();
      
      try {
        console.log("🔍 usePostedJobs - Making Supabase query to 'jobs' table...");
        
        // First, let's check if we can connect to Supabase at all
        const { data: testConnection, error: connectionError } = await supabase
          .from('jobs')
          .select('count(*)', { count: 'exact', head: true });
        
        console.log("🔍 usePostedJobs - Connection test result:", { testConnection, connectionError });
        
        if (connectionError) {
          console.error("❌ usePostedJobs - Connection error:", connectionError);
          throw connectionError;
        }
        
        // Now do the actual query
        const { data, error, count } = await supabase
          .from('jobs')
          .select(`
            *,
            companies (
              name,
              location,
              website,
              description
            )
          `, { count: 'exact' })
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1000);

        console.log("🔍 usePostedJobs - Detailed query result:", { 
          dataLength: data?.length || 0, 
          totalCount: count,
          error,
          firstJob: data?.[0] ? {
            id: data[0].id,
            title: data[0].title,
            is_active: data[0].is_active
          } : null
        });
        
        // Let's also check without the is_active filter
        const { error: allError, count: allCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true });
          
        console.log("🔍 usePostedJobs - Total jobs in table (including inactive):", { 
          totalCount: allCount, 
          error: allError 
        });

        if (error) {
          console.error("❌ usePostedJobs - Error fetching posted jobs:", error);
          trackError(new Error(error.message));
          throw error;
        }
        
        console.log("✅ usePostedJobs - Successfully fetched:", data?.length || 0, "posted jobs");
        return (data || []) as PostedJob[];
      } catch (error) {
        console.error("💥 usePostedJobs - Failed to fetch posted jobs:", error);
        trackError(error as Error);
        return [] as PostedJob[];
      }
    },
    ...CACHE_CONFIG.JOBS,
    refetchInterval: CACHE_CONFIG.JOBS.refetchInterval,
    placeholderData: (previousData) => previousData,
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
      console.log("🔍 useScrapedJobs - Starting fetch...");
      trackNetworkRequest();
      
      try {
        console.log("🔍 useScrapedJobs - Making Supabase query to 'scraped_jobs' table...");
        
        // First, let's check the total count in scraped_jobs
        const { error: connectionError, count: totalCount } = await supabase
          .from('scraped_jobs')
          .select('*', { count: 'exact', head: true });
        
        console.log("🔍 useScrapedJobs - Total scraped jobs in table:", { 
          totalCount, 
          connectionError 
        });
        
        if (connectionError) {
          console.error("❌ useScrapedJobs - Connection error:", connectionError);
          throw connectionError;
        }
        
        // Check jobs with various filters to see what's happening
        const { data: allJobs, error: allError } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
          
        console.log("🔍 useScrapedJobs - Sample of all jobs:", { 
          count: allJobs?.length || 0,
          error: allError,
          sampleJobs: allJobs?.slice(0, 3).map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            hasTitle: !!job.title,
            hasCompany: !!job.company
          }))
        });

        const { data, error } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)
          .not('title', 'is', null)
          .not('company', 'is', null);

        console.log("🔍 useScrapedJobs - Filtered query result:", { 
          dataLength: data?.length || 0, 
          error,
          firstJob: data?.[0] ? {
            id: data[0].id,
            title: data[0].title,
            company: data[0].company
          } : null
        });

        if (error) {
          console.error("❌ useScrapedJobs - Error fetching scraped jobs:", error);
          trackError(new Error(error.message));
          throw error;
        }
        
        console.log("✅ useScrapedJobs - Raw data fetched:", data?.length || 0, "jobs");
        
        // Filter out expired jobs
        const nonExpiredJobs = (data || []).filter(job => !isJobExpired(job));
        console.log(`✅ useScrapedJobs - After filtering expired: ${nonExpiredJobs.length} jobs (removed ${(data || []).length - nonExpiredJobs.length} expired)`);
        
        return nonExpiredJobs as ScrapedJob[];
      } catch (error) {
        console.error("💥 useScrapedJobs - Failed to fetch scraped jobs:", error);
        trackError(error as Error);
        return [] as ScrapedJob[];
      }
    },
    ...CACHE_CONFIG.JOBS,
    refetchInterval: CACHE_CONFIG.JOBS.refetchInterval,
    placeholderData: (previousData) => previousData,
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
    meta: {
      errorHandler: (error: PostgrestError) => {
        console.error("Query error in useCompanies:", error);
        trackError(new Error(error.message));
      }
    }
  });
};
