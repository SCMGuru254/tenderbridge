
import { useState, useEffect } from 'react';
import { PostedJob, ScrapedJob } from '@/types/jobs';
import { usePostedJobs, useScrapedJobs } from './useJobFetching';
import { combineAndDeduplicateJobs, deduplicateScrapedJobs } from './useJobDeduplication';

export const useJobData = () => {
  const [allJobs, setAllJobs] = useState<(PostedJob | ScrapedJob)[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Use our refactored hooks to fetch data
  const { 
    data: postedJobs, 
    isLoading: isLoadingPosted, 
    refetch: refetchPostedJobs,
    error: postedJobsError
  } = usePostedJobs();

  const { 
    data: scrapedJobs, 
    isLoading: isLoadingScraped, 
    refetch: refetchScrapedJobs,
    error: scrapedJobsError
  } = useScrapedJobs();

  // Add debugging logs
  useEffect(() => {
    console.log('useJobData - Posted jobs:', postedJobs?.length || 0);
    console.log('useJobData - Scraped jobs:', scrapedJobs?.length || 0);
    console.log('useJobData - Active tab:', activeTab);
    console.log('useJobData - Posted jobs error:', postedJobsError);
    console.log('useJobData - Scraped jobs error:', scrapedJobsError);
  }, [postedJobs, scrapedJobs, activeTab, postedJobsError, scrapedJobsError]);

  // Combine and filter jobs based on the active tab
  useEffect(() => {
    if (activeTab === "posted" && postedJobs) {
      console.log("Setting jobs to posted jobs:", postedJobs.length);
      setAllJobs(postedJobs);
    } else if (activeTab === "scraped" && scrapedJobs) {
      console.log("Setting jobs to scraped jobs:", scrapedJobs.length);
      
      const dedupedJobs = deduplicateScrapedJobs(scrapedJobs);
      console.log(`Removed ${scrapedJobs.length - dedupedJobs.length} duplicate jobs, showing ${dedupedJobs.length} jobs`);
      
      setAllJobs(dedupedJobs);
    } else if (activeTab === "all") {
      if (postedJobs || scrapedJobs) {
        const combinedJobs = combineAndDeduplicateJobs(postedJobs, scrapedJobs);
        
        if (postedJobs && scrapedJobs) {
          console.log(`Combined ${postedJobs.length} posted and ${scrapedJobs.length} scraped jobs into ${combinedJobs.length} unique jobs`);
        }
        
        setAllJobs(combinedJobs);
      } else {
        console.log("No jobs available from either source");
        setAllJobs([]);
      }
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
    errors: {
      postedJobsError,
      scrapedJobsError
    }
  };
};
