
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useJobData = () => {
  const { data: postedJobs, refetch: refetchPostedJobs } = useQuery({
    queryKey: ['posted-jobs'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data || [];
      } catch (err) {
        console.warn("Local API failed, falling back to Supabase:", err);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (error) {
          console.error("Supabase fallback failed:", error);
          return [];
        }
        return data || [];
      }
    }
  });

  const { data: aggregatedJobs, refetch: refetchAggregatedJobs } = useQuery({
    queryKey: ['aggregated-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    }
  });

  return {
    postedJobs: postedJobs || [],
    aggregatedJobs: aggregatedJobs || [],
    refetchPostedJobs,
    refetchAggregatedJobs
  };
};
