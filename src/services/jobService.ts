import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/utils/errorHandling';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  is_remote: boolean;
  skills?: string[];
  posted_date: string;
  category?: string;
  experience_level?: string;
  job_type?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  appliedAt: string;
  notes?: string;
  nextSteps?: string;
  interviewDate?: string;
}

export interface JobAlert {
  id: string;
  userId: string;
  searchParams: {
    category?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    isRemote?: boolean;
  };
  isActive: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  lastTriggered?: string;
  createdAt: string;
}

export interface JobAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  applications: number;
  savedCount: number;
  shareCount: number;
  averageTimeSpent: number;
}

export class JobService {
  private static instance: JobService;

  private constructor() {}

  static getInstance(): JobService {
    if (!JobService.instance) {
      JobService.instance = new JobService();
    }
    return JobService.instance;
  }

  async getJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error fetching jobs:', handledError);
      return [];
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error fetching job:', handledError);
      return null;
    }
  }

  async searchJobs(query: string): Promise<Job[]> {
    try {
      let queryBuilder = supabase
        .from('jobs')
        .select('*');

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,company.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder
        .order('posted_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error searching jobs:', handledError);
      return [];
    }
  }

  async getJobRecommendations(excludeJobId?: string): Promise<Job[]> {
    try {
      let queryBuilder = supabase
        .from('jobs')
        .select('*');

      if (excludeJobId) {
        queryBuilder = queryBuilder.neq('id', excludeJobId);
      }

      const { data, error } = await queryBuilder
        .order('posted_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error fetching job recommendations:', handledError);
      return [];
    }
  }

  async saveJob(jobId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({ job_id: jobId, user_id: userId });

      if (error) throw error;
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error saving job:', handledError);
      throw handledError;
    }
  }

  async shareJob(): Promise<void> {
    try {
      // Mock implementation for sharing
      console.log('Sharing job functionality');
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error sharing job:', handledError);
      throw handledError;
    }
  }

  async getJobAnalytics(jobId: string): Promise<JobAnalytics> {
    try {
      // Fetch analytics data for the specific job
      const { data, error } = await supabase
        .from('job_analytics')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (error) throw error;

      return {
        totalViews: data.total_views || 0,
        uniqueVisitors: data.unique_visitors || 0,
        applications: data.applications || 0,
        savedCount: data.saved_count || 0,
        shareCount: data.share_count || 0,
        averageTimeSpent: data.average_time_spent || 0
      };
    } catch (error) {
      console.error('Error fetching job analytics:', error);
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        applications: 0,
        savedCount: 0,
        shareCount: 0,
        averageTimeSpent: 0
      };
    }
  }

  async getJobAlerts(userId: string): Promise<JobAlert[]> {
    try {
      // Mock job alerts data
      return [
        {
          id: '1',
          userId,
          searchParams: {
            category: 'Technology',
            location: 'Nairobi',
            jobType: 'full-time',
            experienceLevel: 'mid-level',
            isRemote: false
          },
          isActive: true,
          frequency: 'daily',
          createdAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error fetching job alerts:', handledError);
      return [];
    }
  }

  async updateJobAlert(alertId: string, updates: Partial<JobAlert>): Promise<void> {
    try {
      console.log(`Updating job alert ${alertId}:`, updates);
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error updating job alert:', handledError);
      throw handledError;
    }
  }

  async getJobApplications(userId: string): Promise<JobApplication[]> {
    try {
      // Mock job applications data
      return [
        {
          id: '1',
          jobId: 'Software Engineer at TechCorp',
          userId,
          status: 'applied',
          appliedAt: new Date().toISOString(),
          notes: 'Applied through company website'
        }
      ];
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error fetching job applications:', handledError);
      return [];
    }
  }

  async updateJobApplication(applicationId: string, updates: Partial<JobApplication>): Promise<void> {
    try {
      console.log(`Updating job application ${applicationId}:`, updates);
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error updating job application:', handledError);
      throw handledError;
    }
  }
}

export const jobService = JobService.getInstance();
