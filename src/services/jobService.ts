import { supabase } from '@/integrations/supabase/client';
import type { PostedJob, ScrapedJob } from '@/types/jobs';
import { socialMediaService } from './socialMediaService';
import { cache } from '@/utils/cache';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performance';
import { errorHandler } from '@/utils/errorHandling';

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
  totalViews: number;
  uniqueViewers: number;
  applications: number;
  saveCount: number;
  shareCount: number;
  averageTimeSpent: number;
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
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  notes?: string;
  next_steps?: string;
  interview_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobAlert {
  id: string;
  user_id: string;
  category?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  is_active: boolean;
  last_triggered?: string;
  created_at?: string;
  updated_at?: string;
}

export class JobService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getJobs(filters?: Partial<Job>): Promise<Job[]> {
    try {
      performanceMonitor.startMeasure('fetch-jobs');
      
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
      errorHandler.handleError(error, 'NETWORK');
      analytics.trackError(error as Error);
      return [];
    } finally {
      performanceMonitor.endMeasure('fetch-jobs');
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    try {
      performanceMonitor.startMeasure('fetch-job');
      
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
      errorHandler.handleError(error, 'NETWORK');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('fetch-job');
    }
  }

  async createJobApplication(application: Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>): Promise<JobApplication | null> {
    try {
      performanceMonitor.startMeasure('create-application');

      const { data, error } = await supabase
        .from('job_applications')
        .insert(application)
        .select()
        .single();

      if (error) throw error;

      analytics.trackUserAction('application-create-success');
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('create-application');
    }
  }

  async updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication | null> {
    try {
      performanceMonitor.startMeasure('update-application');

      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      analytics.trackUserAction('application-update-success');
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('update-application');
    }
  }

  async getJobApplications(userId: string): Promise<JobApplication[]> {
    try {
      performanceMonitor.startMeasure('fetch-applications');
      
      const cacheKey = `applications-${userId}`;
      const cachedApplications = cache.get<JobApplication[]>(cacheKey);
      if (cachedApplications) {
        analytics.trackUserAction('applications-cache-hit');
        return cachedApplications;
      }

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const applications = data || [];
      cache.set(cacheKey, applications, { ttl: this.CACHE_TTL });
      analytics.trackUserAction('applications-fetch-success', `count:${applications.length}`);
      
      return applications;
    } catch (error) {
      errorHandler.handleError(error, 'NETWORK');
      analytics.trackError(error as Error);
      return [];
    } finally {
      performanceMonitor.endMeasure('fetch-applications');
    }
  }

  async createJobAlert(alert: Omit<JobAlert, 'id' | 'created_at' | 'updated_at'>): Promise<JobAlert | null> {
    try {
      performanceMonitor.startMeasure('create-alert');

      const { data, error } = await supabase
        .from('job_alerts')
        .insert(alert)
        .select()
        .single();

      if (error) throw error;

      analytics.trackUserAction('alert-create-success');
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('create-alert');
    }
  }

  async updateJobAlert(id: string, updates: Partial<JobAlert>): Promise<JobAlert | null> {
    try {
      performanceMonitor.startMeasure('update-alert');

      const { data, error } = await supabase
        .from('job_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      analytics.trackUserAction('alert-update-success');
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('update-alert');
    }
  }

  async getJobAlerts(userId: string): Promise<JobAlert[]> {
    try {
      performanceMonitor.startMeasure('fetch-alerts');
      
      const cacheKey = `alerts-${userId}`;
      const cachedAlerts = cache.get<JobAlert[]>(cacheKey);
      if (cachedAlerts) {
        analytics.trackUserAction('alerts-cache-hit');
        return cachedAlerts;
      }

      const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const alerts = data || [];
      cache.set(cacheKey, alerts, { ttl: this.CACHE_TTL });
      analytics.trackUserAction('alerts-fetch-success', `count:${alerts.length}`);
      
      return alerts;
    } catch (error) {
      errorHandler.handleError(error, 'NETWORK');
      analytics.trackError(error as Error);
      return [];
    } finally {
      performanceMonitor.endMeasure('fetch-alerts');
    }
  }

  async deleteJobAlert(id: string): Promise<boolean> {
    try {
      performanceMonitor.startMeasure('delete-alert');

      const { error } = await supabase
        .from('job_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      analytics.trackUserAction('alert-delete-success');
      return true;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return false;
    } finally {
      performanceMonitor.endMeasure('delete-alert');
    }
  }
}

export const jobService = new JobService();

// Helper functions for job recommendations
function calculateJobMatchScore(job: PostedJob | ScrapedJob, userPreferences: any): number {
  let score = 0;
  
  // Match skills
  if (job.skills && userPreferences?.skills) {
    const matchingSkills = job.skills.filter(skill => 
      userPreferences.skills.includes(skill)
    );
    score += matchingSkills.length * 10;
  }

  // Match location
  if (job.location && userPreferences?.preferredLocations?.includes(job.location)) {
    score += 20;
  }

  // Match job type
  if (job.job_type && userPreferences?.preferredJobTypes?.includes(job.job_type)) {
    score += 15;
  }

  // Match experience level
  if (job.experience_level && userPreferences?.experienceLevel === job.experience_level) {
    score += 15;
  }

  // Match remote preference
  if (job.is_remote === userPreferences?.prefersRemote) {
    score += 10;
  }

  return score;
}

function findMatchingSkills(job: PostedJob | ScrapedJob, userPreferences: any): string[] {
  if (!job.skills || !userPreferences?.skills) return [];
  return job.skills.filter(skill => userPreferences.skills.includes(skill));
}

function findMatchingKeywords(job: PostedJob | ScrapedJob, userPreferences: any): string[] {
  if (!job.tags || !userPreferences?.keywords) return [];
  return job.tags.filter(tag => userPreferences.keywords.includes(tag));
}

// Helper function for enhanced recommendations
async function calculateEnhancedMatchScore(
  job: PostedJob | ScrapedJob,
  userData: {
    profile: any;
    preferences: any;
    applicationHistory: JobApplication[];
  }
): Promise<number> {
  // Implement AI-based matching algorithm here
  // This could use embeddings, semantic similarity, or other ML techniques
  // For now, return a basic score
  return Math.random();
}
