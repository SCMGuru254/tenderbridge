
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export const isValidJobData = (data: any): boolean => {
  return data && typeof data === 'object' && data.title && data.id;
};

export const extractCompanyName = (job: PostedJob | ScrapedJob): string | null => {
  const companyName = (job as any)?.company?.name || (job as any)?.company || '';
  
  if (typeof companyName === 'string' && companyName.trim()) {
    return companyName.trim();
  }
  
  return null;
};

export const extractJobLocation = (job: PostedJob | ScrapedJob): string | null => {
  const location = (job as any)?.location || '';
  
  if (typeof location === 'string' && location.trim()) {
    return location.trim();
  }
  
  return null;
};

export const formatJobType = (jobType: string | null | undefined): string => {
  if (!jobType) return 'Not specified';
  return jobType.charAt(0).toUpperCase() + jobType.slice(1).toLowerCase();
};

export const isRecentJob = (dateString: string | null | undefined, daysThreshold: number = 30): boolean => {
  if (!dateString) return false;
  
  const jobDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - jobDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= daysThreshold;
};
