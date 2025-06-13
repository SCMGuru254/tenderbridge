import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const BATCH_SIZE = 50;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface JobMatch {
  job: any;
  score: number;
  matchingFactors: string[];
}

interface CacheEntry {
  timestamp: number;
  matches: JobMatch[];
}

const matchCache = new Map<string, CacheEntry>();

export const useEnhancedJobMatcher = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const getCachedMatches = useCallback((key: string) => {
    const cached = matchCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.matches;
    }
    return null;
  }, []);

  const processJobBatch = useCallback(async (
    jobs: any[],
    userProfile: any,
    onProgress?: (progress: number) => void
  ) => {
    const results: JobMatch[] = [];
    
    for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
      const batch = jobs.slice(i, i + BATCH_SIZE);
      
      const { data: batchResults, error } = await supabase.functions.invoke('job-match', {
        body: {
          jobs: batch,
          userProfile
        }
      });

      if (error) throw error;
      
      results.push(...batchResults);
      
      // Report progress
      if (onProgress) {
        const progress = Math.min(((i + BATCH_SIZE) / jobs.length) * 100, 100);
        onProgress(progress);
      }
      
      // Allow UI updates between batches
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  }, []);

  const findMatches = useCallback(async (
    query: string,
    userProfile: any,
    onProgress?: (progress: number) => void
  ) => {
    setIsProcessing(true);
    
    try {
      // Check cache first
      const cacheKey = `${query}_${userProfile.id}`;
      const cachedResults = getCachedMatches(cacheKey);
      if (cachedResults) {
        return cachedResults;
      }

      // Quick initial match using keywords
      const { data: quickMatches, error: quickError } = await supabase.functions.invoke('job-match-quick', {
        body: {
          query,
          userProfile
        }
      });

      if (quickError) throw quickError;

      // Process full matches in batches
      const enhancedMatches = await processJobBatch(quickMatches, userProfile, onProgress);

      // Cache results
      matchCache.set(cacheKey, {
        timestamp: Date.now(),
        matches: enhancedMatches
      });

      return enhancedMatches;
    } catch (error) {
      console.error('Job matching error:', error);
      toast({
        title: 'Matching failed',
        description: 'Unable to process job matches. Please try again.',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [getCachedMatches, processJobBatch, toast]);

  return {
    findMatches,
    isProcessing
  };
};
