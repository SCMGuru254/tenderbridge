
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
        console.log("🔍 usePostedJobs - Testing basic connection to Supabase...");
        
        // Test basic connection first
        const { error: tablesError } = await supabase
          .from('jobs')
          .select('id', { count: 'exact', head: true });
        
        console.log("🔍 usePostedJobs - Table exists check:", { 
          tablesError: tablesError?.message || 'No error',
          canAccessTable: !tablesError 
        });
        
        if (tablesError) {
          console.error("❌ usePostedJobs - Cannot access jobs table:", tablesError);
          throw tablesError;
        }
        
        // Check total count of all jobs
        const { error: allCountError, count: totalJobs } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true });
          
        console.log("🔍 usePostedJobs - Total jobs in database:", { 
          totalJobs, 
          error: allCountError?.message || 'No error' 
        });
        
        // Check active jobs count
        const { error: activeCountError, count: activeJobs } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);
          
        console.log("🔍 usePostedJobs - Active jobs count:", { 
          activeJobs, 
          error: activeCountError?.message || 'No error' 
        });
        
        // Try to fetch actual data
        const { data, error, count } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10); // Limit to 10 for debugging

        console.log("🔍 usePostedJobs - Query result:", { 
          dataCount: data?.length || 0, 
          totalCount: count,
          error: error?.message || 'No error',
          firstJob: data?.[0] ? {
            id: data[0].id,
            title: data[0].title,
            is_active: data[0].is_active,
            created_at: data[0].created_at
          } : 'No jobs found'
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
        console.log("🔍 useScrapedJobs - Testing basic connection to scraped_jobs table...");
        
        // Test basic connection first
        const { error: tablesError } = await supabase
          .from('scraped_jobs')
          .select('id', { count: 'exact', head: true });
        
        console.log("🔍 useScrapedJobs - Table exists check:", { 
          tablesError: tablesError?.message || 'No error',
          canAccessTable: !tablesError 
        });
        
        if (tablesError) {
          console.error("❌ useScrapedJobs - Cannot access scraped_jobs table:", tablesError);
          throw tablesError;
        }
        
        // Check total count of all scraped jobs
        const { error: countError, count: totalCount } = await supabase
          .from('scraped_jobs')
          .select('*', { count: 'exact', head: true });
        
        console.log("🔍 useScrapedJobs - Total scraped jobs in table:", { 
          totalCount, 
          countError: countError?.message || 'No error' 
        });
        
        // Get a sample of jobs to see what's in the table
        const { data: sampleJobs, error: sampleError } = await supabase
          .from('scraped_jobs')
          .select('id, title, company, source, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
          
        console.log("🔍 useScrapedJobs - Sample jobs:", { 
          count: sampleJobs?.length || 0,
          error: sampleError?.message || 'No error',
          jobs: sampleJobs?.map(job => ({
            id: job.id,
            title: job.title || 'No title',
            company: job.company || 'No company',
            source: job.source || 'No source'
          })) || []
        });

        // Try the filtered query
        const { data, error } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)
          .not('title', 'is', null)
          .not('company', 'is', null);

        console.log("🔍 useScrapedJobs - Filtered query result:", { 
          dataLength: data?.length || 0, 
          error: error?.message || 'No error',
          firstJob: data?.[0] ? {
            id: data[0].id,
            title: data[0].title,
            company: data[0].company,
            source: data[0].source
          } : 'No jobs found'
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
