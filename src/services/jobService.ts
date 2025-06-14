
import { supabase } from '@/integrations/supabase/client';
import type { PostedJob, ScrapedJob } from '@/types/jobs';
import { cache } from '@/utils/cache';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { errorHandler } from '@/utils/errors';

export interface JobFilters {
  category?: string;
  location?: string;
  jobType?: string;
  salaryRange?: string;
  experienceLevel?: string;
  skills?: string[];
  isRemote?: boolean;
  companySize?: string;
  postedWithin?: string;
}

export interface JobRecommendation {
  job: PostedJob | ScrapedJob;
  matchScore: number;
  matchingSkills: string[];
  matchingKeywords: string[];
}

export interface JobAlert {
  id: string;
  userId: string;
  searchParams: JobFilters;
  frequency: 'daily' | 'weekly' | 'instant';
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  nextSteps?: string;
  interviewDate?: string;
}

export interface JobAnalytics {
  jobId: string;
  views: number;
  applications: number;
  shares: number;
  saves: number;
  averageTimeSpent: number;
  uniqueVisitors: number;
  applicationConversionRate: number;
  sourceBreakdown: Record<string, number>;
  trend: {
    date: string;
    views: number;
    applications: number;
  }[];
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  job_type: string;
  experience_level: string;
  category: string;
  created_at?: string;
  updated_at?: string;
  status: 'active' | 'closed';
  skills?: string[];
  is_remote?: boolean;
}

export class JobService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getJobs(filters?: Partial<Job>): Promise<Job[]> {
    try {
      performanceMonitor.startTimer('fetch-jobs');
      
      const cacheKey = `jobs-${JSON.stringify(filters)}`;
      const cachedJobs = cache.get<Job[]>(cacheKey);
      if (cachedJobs) {
        analytics.trackUserAction('jobs-cache-hit');
        return cachedJobs;
      }

      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active');

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      const jobs = data || [];
      cache.set(cacheKey, jobs, { ttl: this.CACHE_TTL });
      analytics.trackUserAction('jobs-fetch-success', `count:${jobs.length}`);
      
      return jobs;
    } catch (error) {
      errorHandler.handleError(error as Error, 'NETWORK');
      analytics.trackError(error as Error);
      return [];
    } finally {
      performanceMonitor.endTimer('fetch-jobs');
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    try {
      performanceMonitor.startTimer('fetch-job');
      
      const cacheKey = `job-${id}`;
      const cachedJob = cache.get<Job>(cacheKey);
      if (cachedJob) {
        analytics.trackUserAction('job-cache-hit');
        return cachedJob;
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        cache.set(cacheKey, data, { ttl: this.CACHE_TTL });
        analytics.trackUserAction('job-fetch-success');
      }
      
      return data;
    } catch (error) {
      errorHandler.handleError(error as Error, 'NETWORK');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endTimer('fetch-job');
    }
  }

  async getJobRecommendations(currentJobId?: string): Promise<Job[]> {
    try {
      performanceMonitor.startTimer('fetch-recommendations');
      
      // For now, return a simple list of active jobs
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      errorHandler.handleError(error as Error, 'NETWORK');
      return [];
    } finally {
      performanceMonitor.endTimer('fetch-recommendations');
    }
  }

  async saveJob(jobId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({ job_id: jobId, user_id: userId });

      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleError(error as Error, 'SERVER');
      return false;
    }
  }

  async shareJob(jobId: string): Promise<boolean> {
    try {
      // Update share count or perform share logic
      console.log(`Sharing job ${jobId}`);
      return true;
    } catch (error) {
      errorHandler.handleError(error as Error, 'SERVER');
      return false;
    }
  }

  async getJobAnalytics(jobId: string): Promise<JobAnalytics> {
    try {
      performanceMonitor.startTimer('getJobAnalytics');

      // Mock analytics data for now
      const analytics: JobAnalytics = {
        jobId,
        views: Math.floor(Math.random() * 1000) + 100,
        applications: Math.floor(Math.random() * 50) + 10,
        shares: Math.floor(Math.random() * 20) + 5,
        saves: Math.floor(Math.random() * 30) + 15,
        averageTimeSpent: Math.floor(Math.random() * 300) + 60,
        uniqueVisitors: Math.floor(Math.random() * 800) + 80,
        applicationConversionRate: Math.random() * 10 + 2,
        sourceBreakdown: {
          direct: 40,
          social: 30,
          referral: 20,
          search: 10
        },
        trend: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 100) + 20,
          applications: Math.floor(Math.random() * 10) + 2
        })),
        updatedAt: new Date().toISOString()
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching job analytics:', error);
      throw new Error('Failed to fetch job analytics');
    } finally {
      performanceMonitor.endTimer('getJobAnalytics');
    }
  }
}

export const jobService = new JobService();
