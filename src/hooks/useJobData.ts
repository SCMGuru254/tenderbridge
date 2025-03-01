
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PostedJob, ScrapedJob } from '@/types/jobs';
import { isJobExpired } from '@/utils/jobUtils';

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
    },
    refetchInterval: 1000 * 60 * 30 // Refetch every 30 minutes
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
      
      // Filter out any obviously expired jobs
      const nonExpiredJobs = data.filter(job => !isJobExpired(job));
      console.log(`Filtered out ${data.length - nonExpiredJobs.length} expired jobs, showing ${nonExpiredJobs.length} jobs`);
      
      // Check if we have jobs from different sources
      const sources = [...new Set(nonExpiredJobs.map(job => job.source))];
      console.log("Job sources:", sources);
      
      return nonExpiredJobs as ScrapedJob[];
    },
    refetchInterval: 1000 * 60 * 30 // Refetch every 30 minutes
  });

  // Enhanced duplicate detection and job merging
  // Combine and filter jobs based on the active tab
  useEffect(() => {
    if (activeTab === "posted" && postedJobs) {
      console.log("Setting jobs to posted jobs:", postedJobs.length);
      setAllJobs(postedJobs);
    } else if (activeTab === "scraped" && scrapedJobs) {
      console.log("Setting jobs to scraped jobs:", scrapedJobs.length);
      
      // Handle duplicate job detection (for jobs from multiple sources)
      const jobMap = new Map();
      
      scrapedJobs.forEach(job => {
        // Create a normalized title for better matching
        const normalizedTitle = job.title?.toLowerCase()
            .replace(/\s+/g, ' ')  // normalize whitespace
            .replace(/[^\w\s]/g, '') // remove punctuation
            .trim() || '';
        
        // Create a normalized company name
        const normalizedCompany = job.company?.toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s]/g, '')
            .trim() || '';
        
        // Create a composite key with more variables for better deduplication
        const key = `${normalizedTitle}:${normalizedCompany}:${job.location?.toLowerCase().trim() || ''}`;
        
        // Skip very short or generic titles that might cause false duplicates
        if (normalizedTitle.length < 5 || normalizedTitle.includes('job') || normalizedTitle.includes('position')) {
          // For very generic titles, add source to key to reduce false positives
          const keyWithSource = `${key}:${job.source || ''}`;
          
          if (!jobMap.has(keyWithSource) || new Date(job.created_at) > new Date(jobMap.get(keyWithSource).created_at)) {
            jobMap.set(keyWithSource, job);
          }
        } else {
          // For normal titles, use standard deduplication
          if (!jobMap.has(key) || new Date(job.created_at) > new Date(jobMap.get(key).created_at)) {
            jobMap.set(key, job);
          }
        }
      });
      
      const dedupedJobs = Array.from(jobMap.values());
      console.log(`Removed ${scrapedJobs.length - dedupedJobs.length} duplicate jobs, showing ${dedupedJobs.length} jobs`);
      
      setAllJobs(dedupedJobs);
    } else if (activeTab === "all") {
      if (postedJobs && scrapedJobs) {
        // Combine and deduplicate jobs with improved algorithm
        const allJobsMap = new Map();
        
        // Process posted jobs first (they take priority)
        postedJobs.forEach(job => {
          // Create normalized strings for better matching
          const normalizedTitle = job.title?.toLowerCase()
              .replace(/\s+/g, ' ')
              .replace(/[^\w\s]/g, '')
              .trim() || '';
              
          const normalizedCompany = getCompanyName(job)?.toLowerCase()
              .replace(/\s+/g, ' ')
              .replace(/[^\w\s]/g, '')
              .trim() || '';
              
          const normalizedLocation = job.location?.toLowerCase()
              .replace(/\s+/g, ' ')
              .trim() || '';
          
          // Create a composite key
          const key = `${normalizedTitle}:${normalizedCompany}:${normalizedLocation}`;
          allJobsMap.set(key, job);
        });
        
        // Process scraped jobs
        scrapedJobs.forEach(job => {
          // Create normalized strings for better matching
          const normalizedTitle = job.title?.toLowerCase()
              .replace(/\s+/g, ' ')
              .replace(/[^\w\s]/g, '')
              .trim() || '';
              
          const normalizedCompany = job.company?.toLowerCase()
              .replace(/\s+/g, ' ')
              .replace(/[^\w\s]/g, '')
              .trim() || '';
              
          const normalizedLocation = job.location?.toLowerCase()
              .replace(/\s+/g, ' ')
              .trim() || '';
          
          // Create a composite key
          const key = `${normalizedTitle}:${normalizedCompany}:${normalizedLocation}`;
          
          // Skip very short or generic titles in deduplication
          if (normalizedTitle.length < 5) {
            // For very generic titles, add source to key to reduce false positives
            const keyWithSource = `${key}:${job.source || ''}`;
            if (!allJobsMap.has(keyWithSource)) {
              allJobsMap.set(keyWithSource, job);
            }
          } else if (!allJobsMap.has(key)) {
            // Only add if a similar job doesn't exist
            allJobsMap.set(key, job);
          }
        });
        
        const combinedJobs = Array.from(allJobsMap.values());
        console.log(`Combined ${postedJobs.length} posted and ${scrapedJobs.length} scraped jobs into ${combinedJobs.length} unique jobs`);
        
        setAllJobs(combinedJobs);
      }
    }
  }, [activeTab, postedJobs, scrapedJobs]);

  const isLoading = isLoadingPosted || isLoadingScraped;

  // Helper function to get company name for deduplication
  const getCompanyName = (job: PostedJob | ScrapedJob): string | null => {
    if ('companies' in job && job.companies) {
      return job.companies.name;
    }
    if ('company' in job) {
      return job.company;
    }
    return null;
  };

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
