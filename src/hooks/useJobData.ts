
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
      console.log("Fetching posted jobs...");
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

      if (error) {
        console.error("Error fetching posted jobs:", error);
        throw error;
      }
      console.log("Posted jobs:", data);
      return data as PostedJob[];
    }
  });

  const { data: scrapedJobs, isLoading: isLoadingScraped, refetch: refetchScrapedJobs } = useQuery({
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
      return data as ScrapedJob[];
    }
  });

  // Combine and filter jobs based on the active tab
  useEffect(() => {
    if (activeTab === "posted" && postedJobs) {
      console.log("Setting jobs to posted jobs:", postedJobs.length);
      setAllJobs(postedJobs);
    } else if (activeTab === "scraped" && scrapedJobs) {
      console.log("Setting jobs to scraped jobs:", scrapedJobs.length);
      setAllJobs(scrapedJobs);
    } else if (activeTab === "all") {
      const combined = [
        ...(postedJobs || []),
        ...(scrapedJobs || []),
      ];
      console.log("Setting jobs to combined:", combined.length);
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
