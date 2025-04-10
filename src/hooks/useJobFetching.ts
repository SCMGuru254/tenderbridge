
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PostedJob, ScrapedJob } from '@/types/jobs';
import { isJobExpired } from '@/utils/jobUtils';

// Fetch posted jobs from the database
export const usePostedJobs = () => {
  return useQuery({
    queryKey: ['posted-jobs'],
    queryFn: async () => {
      console.log("Fetching posted jobs...");
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
      return data as PostedJob[];
    },
    refetchInterval: 1000 * 60 * 30 // Refetch every 30 minutes
  });
};

// Fetch scraped jobs from the database with duplicate and expired job filtering
export const useScrapedJobs = () => {
  return useQuery({
    queryKey: ['scraped-jobs'],
    queryFn: async () => {
      console.log("Fetching scraped jobs...");
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
      const nonExpiredJobs = data.filter(job => !isJobExpired(job));
      console.log(`Filtered out ${data.length - nonExpiredJobs.length} expired jobs, showing ${nonExpiredJobs.length} jobs`);
      
      return nonExpiredJobs as ScrapedJob[];
    },
    refetchInterval: 1000 * 60 * 30 // Refetch every 30 minutes
  });
};

// Fetch companies
export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log("Fetching companies...");
      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) {
        console.error("Error fetching companies:", error);
        throw error;
      }
      
      console.log("Companies:", data);
      return data;
    }
  });
};
