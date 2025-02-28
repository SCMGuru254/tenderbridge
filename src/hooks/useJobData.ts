
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PostedJob, ScrapedJob } from '@/types/jobs';

export const useJobData = () => {
  const [allJobs, setAllJobs] = useState<(PostedJob | ScrapedJob)[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const { data: postedJobs, isLoading: isLoadingPosted, refetch: refetchPostedJobs } = useQuery({
    queryKey: ['posted-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name,
            location
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data as PostedJob[];
    }
  });

  const { data: scrapedJobs, isLoading: isLoadingScraped, refetch: refetchScrapedJobs } = useQuery({
    queryKey: ['scraped-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Scraped jobs:", data);
      return data as ScrapedJob[];
    }
  });

  // Combine and filter jobs based on the active tab
  useEffect(() => {
    if (activeTab === "posted" && postedJobs) {
      setAllJobs(postedJobs);
    } else if (activeTab === "scraped" && scrapedJobs) {
      setAllJobs(scrapedJobs);
    } else if (activeTab === "all") {
      const combined = [
        ...(postedJobs || []),
        ...(scrapedJobs || []),
      ];
      setAllJobs(combined);
    }
  }, [activeTab, postedJobs, scrapedJobs]);

  const isLoading = isLoadingPosted || isLoadingScraped;

  return {
    postedJobs,
    scrapedJobs,
    allJobs,
    isLoading,
    activeTab,
    setActiveTab,
    refetchPostedJobs,
    refetchScrapedJobs,
  };
};
