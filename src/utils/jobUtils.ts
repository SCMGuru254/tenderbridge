
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export const formatSalary = (job: PostedJob | ScrapedJob): string | null => {
  if ('salary_range' in job && job.salary_range) {
    return job.salary_range;
  }
  return null;
};

export const getJobCompany = (job: PostedJob | ScrapedJob): string | null => {
  if ('company' in job && job.company) {
    return job.company;
  }
  if ('posted_by' in job && job.posted_by) {
    return job.posted_by;
  }
  return 'Company not specified';
};

export const getJobLocation = (job: PostedJob | ScrapedJob): string | null => {
  if (job.location) {
    return job.location;
  }
  return 'Location not specified';
};

export const getJobUrl = (job: PostedJob | ScrapedJob): string | null => {
  if ('job_url' in job && job.job_url) {
    return job.job_url;
  }
  if ('application_url' in job && job.application_url) {
    return job.application_url;
  }
  return null;
};

export const isScrapedJob = (job: PostedJob | ScrapedJob): job is ScrapedJob => {
  return 'source' in job;
};

export const formatJobType = (jobType: string | undefined): string => {
  if (!jobType) return 'Not specified';
  return jobType.charAt(0).toUpperCase() + jobType.slice(1);
};

export const getJobDeadline = (job: PostedJob | ScrapedJob): string | null => {
  if ('application_deadline' in job && job.application_deadline) {
    return job.application_deadline;
  }
  return null;
};
