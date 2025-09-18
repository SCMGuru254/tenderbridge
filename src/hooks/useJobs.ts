import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Job, JobApplication } from '@/types/database';

interface JobFilters {
  location?: string;
  jobType?: Job['job_type'];
  experienceLevel?: Job['experience_level'];
  minSalary?: number;
  isRemote?: boolean;
  skills?: string[];
}

interface UseJobsOptions {
  filters?: JobFilters;
  includeSkills?: boolean;
  pageSize?: number;
}

interface UseJobsResult {
  jobs: Job[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refreshJobs: () => Promise<void>;
}

export const useJobs = (options: UseJobsOptions = {}): UseJobsResult => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const pageSize = options.pageSize || 10;
  const filters = options.filters || {};

  const fetchJobs = async (isLoadMore = false) => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('jobs')
        .select(options.includeSkills ? '*, job_skills(*)' : '*', { count: 'exact' });

      // Apply filters
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.jobType) {
        query = query.eq('job_type', filters.jobType);
      }
      if (filters.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel);
      }
      if (filters.minSalary) {
        query = query.gte('salary_min', filters.minSalary);
      }
      if (filters.isRemote !== undefined) {
        query = query.eq('is_remote', filters.isRemote);
      }
      if (filters.skills?.length) {
        query = query.contains('required_skills', filters.skills);
      }

      // Add pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: jobsError, count } = await query;

      if (jobsError) throw jobsError;

      // Type assertion after basic validation
      const jobsArray = Array.isArray(data) ? data : [];
      const validJobs = jobsArray.filter(job => job && typeof job === 'object') as unknown as Job[];

      setJobs(prev => isLoadMore ? [...prev, ...validJobs] : validJobs);
      if (count !== null) {
        setTotalCount(count);
        setHasMore(from + validJobs.length < count);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchJobs();
  }, [JSON.stringify(filters)]);

  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    setPage(prev => prev + 1);
    await fetchJobs(true);
  };

  const refreshJobs = () => fetchJobs();

  return {
    jobs,
    totalCount,
    isLoading,
    error,
    hasMore,
    loadMore,
    refreshJobs
  };
};

interface UseJobApplicationOptions {
  jobId?: string;
  userId?: string;
}

interface UseJobApplicationsResult {
  applications: JobApplication[];
  isLoading: boolean;
  error: Error | null;
  submitApplication: (data: Omit<JobApplication, 'id' | 'created_at'>) => Promise<void>;
  updateApplication: (id: string, data: Partial<JobApplication>) => Promise<void>;
}

export const useJobApplications = (options: UseJobApplicationOptions = {}): UseJobApplicationsResult => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase.from('job_applications').select('*');

        if (options.jobId) {
          query = query.eq('job_id', options.jobId);
        }
        if (options.userId) {
          query = query.eq('applicant_id', options.userId);
        }

        const { data, error: fetchError } = await query;
        if (fetchError) throw fetchError;

        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [options.jobId, options.userId]);

  const submitApplication = async (data: Omit<JobApplication, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('job_applications').insert(data);
      if (error) throw error;

      // Refresh applications
      const { data: updated, error: fetchError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', data.job_id)
        .eq('applicant_id', data.applicant_id)
        .single();

      if (fetchError) throw fetchError;
      setApplications(prev => [...prev, updated]);
    } catch (err) {
      console.error('Error submitting application:', err);
      throw err instanceof Error ? err : new Error('Failed to submit application');
    }
  };

  const updateApplication = async (id: string, data: Partial<JobApplication>) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      setApplications(prev =>
        prev.map(app => (app.id === id ? { ...app, ...data } : app))
      );
    } catch (err) {
      console.error('Error updating application:', err);
      throw err instanceof Error ? err : new Error('Failed to update application');
    }
  };

  return {
    applications,
    isLoading,
    error,
    submitApplication,
    updateApplication
  };
};