
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
    console.log('🔍 useJobData - Posted jobs count:', postedJobs?.length || 0);
    console.log('🔍 useJobData - Scraped jobs count:', scrapedJobs?.length || 0);
    console.log('🔍 useJobData - Active tab:', activeTab);
    console.log('🔍 useJobData - Loading states:', { isLoadingPosted, isLoadingScraped });
    
    if (postedJobsError) {
      console.error('❌ useJobData - Posted jobs error:', postedJobsError);
    }
    if (scrapedJobsError) {
      console.error('❌ useJobData - Scraped jobs error:', scrapedJobsError);
    }
  }, [postedJobs, scrapedJobs, activeTab, postedJobsError, scrapedJobsError, isLoadingPosted, isLoadingScraped]);

  // Combine and filter jobs based on the active tab
  useEffect(() => {
    console.log('🔍 useJobData - Processing jobs for tab:', activeTab);
    
    if (activeTab === "posted" && postedJobs) {
      console.log("✅ useJobData - Setting jobs to posted jobs:", postedJobs.length);
      setAllJobs(postedJobs);
    } else if (activeTab === "scraped" && scrapedJobs) {
      console.log("✅ useJobData - Setting jobs to scraped jobs:", scrapedJobs.length);
      
      const dedupedJobs = deduplicateScrapedJobs(scrapedJobs);
      console.log(`✅ useJobData - After deduplication: ${dedupedJobs.length} jobs (removed ${scrapedJobs.length - dedupedJobs.length} duplicates)`);
      
      setAllJobs(dedupedJobs);
    } else if (activeTab === "all") {
      if (postedJobs || scrapedJobs) {
        const combinedJobs = combineAndDeduplicateJobs(postedJobs, scrapedJobs);
        
        console.log(`✅ useJobData - Combined jobs: ${postedJobs?.length || 0} posted + ${scrapedJobs?.length || 0} scraped = ${combinedJobs.length} total`);
        
        setAllJobs(combinedJobs);
      } else {
        console.log("⚠️ useJobData - No jobs available from either source");
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
