
import { supabase } from '@/integrations/supabase/client';
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export interface JobFilters {
  category?: string;
  location?: string;
  jobType?: string;
  salaryRange?: string;
}

export const jobService = {
  async getPostedJobs(filters?: JobFilters): Promise<PostedJob[]> {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.ilike('title', `%${filters.category}%`);
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.jobType) {
        query = query.eq('job_type', filters.jobType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
      return [];
    }
  },

  async getScrapedJobs(filters?: JobFilters): Promise<ScrapedJob[]> {
    try {
      let query = supabase
        .from('scraped_jobs')
        .select('*')
        .eq('is_scam', false)
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.or(`title.ilike.%${filters.category}%,category.ilike.%${filters.category}%`);
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.jobType) {
        query = query.eq('job_type', filters.jobType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching scraped jobs:', error);
      return [];
    }
  },

  async searchJobs(searchTerm: string, filters?: JobFilters): Promise<(PostedJob | ScrapedJob)[]> {
    const [postedJobs, scrapedJobs] = await Promise.all([
      this.getPostedJobs({ ...filters }),
      this.getScrapedJobs({ ...filters })
    ]);

    const allJobs = [...postedJobs, ...scrapedJobs];

    if (!searchTerm) return allJobs;

    return allJobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  async getJobById(id: string, type: 'posted' | 'scraped'): Promise<PostedJob | ScrapedJob | null> {
    try {
      const table = type === 'posted' ? 'jobs' : 'scraped_jobs';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      return null;
    }
  },

  async reportJob(jobId: string, reason: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_reports')
        .insert({
          job_id: jobId,
          reason,
          reported_by: userId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reporting job:', error);
      return false;
    }
  }
};
