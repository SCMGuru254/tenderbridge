
import { supabase } from '@/integrations/supabase/client';
import type { JobAnalyticsData, JobAlert, JobApplication } from '@/types/jobAnalytics';

export interface Job {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  description?: string;
  job_type?: string | null;
  category?: string;
  job_url?: string | null;
  application_deadline?: string | null;
  social_shares?: Record<string, any>;
  skills?: string[];
  is_remote?: boolean;
  created_at: string;
  updated_at: string;
}

class JobService {
  async getJobAnalytics(jobId: string): Promise<JobAnalyticsData> {
    console.log('Getting analytics for job:', jobId);
    // Mock implementation - replace with actual API call
    return {
      totalViews: 245,
      uniqueViewers: 189,
      applications: 23,
      saveCount: 45,
      shareCount: 12,
      averageTimeSpent: 180
    };
  }

  async getJobRecommendations(currentJobId?: string): Promise<Job[]> {
    console.log('Getting job recommendations for:', currentJobId);
    
    // Get scraped jobs as recommendations
    const { data: scrapedJobs, error } = await supabase
      .from('scraped_jobs')
      .select('*')
      .limit(10);

    if (error) {
      console.error('Error fetching job recommendations:', error);
      return [];
    }

    return scrapedJobs?.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      job_type: job.job_type,
      category: job.category,
      job_url: job.job_url,
      application_deadline: job.application_deadline,
      social_shares: job.social_shares,
      skills: job.skills || [],
      is_remote: job.employment_type === 'remote',
      created_at: job.created_at,
      updated_at: job.updated_at
    })) || [];
  }

  async saveJob(jobId: string, userId: string): Promise<void> {
    console.log('Saving job:', jobId, 'for user:', userId);
    
    const { error } = await supabase
      .from('saved_jobs')
      .insert([{
        job_id: jobId,
        user_id: userId,
        status: 'saved'
      }]);

    if (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  async shareJob(jobId: string): Promise<void> {
    console.log('Sharing job:', jobId);
    // Mock implementation for sharing
  }

  async getJobAlerts(userId: string): Promise<JobAlert[]> {
    console.log('Getting job alerts for user:', userId);
    // Mock implementation
    return [
      {
        id: '1',
        userId,
        searchParams: {
          category: 'Supply Chain',
          location: 'Nairobi',
          jobType: 'full-time'
        },
        isActive: true,
        frequency: 'daily',
        createdAt: new Date().toISOString()
      }
    ];
  }

  async updateJobAlert(alertId: string, updates: Partial<JobAlert>): Promise<void> {
    console.log('Updating job alert:', alertId, updates);
    // Mock implementation
  }

  async getJobApplications(userId: string): Promise<JobApplication[]> {
    console.log('Getting job applications for user:', userId);
    // Mock implementation
    return [
      {
        id: '1',
        jobId: 'job-1',
        userId,
        status: 'applied',
        appliedAt: new Date().toISOString(),
        notes: 'Applied via website'
      }
    ];
  }

  async updateJobApplication(applicationId: string, updates: Partial<JobApplication>): Promise<void> {
    console.log('Updating job application:', applicationId, updates);
    // Mock implementation
  }
}

export const jobService = new JobService();
export { JobService };
export type { JobAnalyticsData, JobAlert, JobApplication };
