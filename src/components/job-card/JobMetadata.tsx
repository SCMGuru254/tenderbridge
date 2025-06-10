
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Building } from 'lucide-react';
import type { PostedJob, ScrapedJob } from '@/types/jobs';

export interface JobMetadataProps {
  job: PostedJob | ScrapedJob;
  socialShares?: Record<string, any>;
}

const JobMetadata: React.FC<JobMetadataProps> = ({ job, socialShares }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const getJobTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'full_time': 'Full Time',
      'part_time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'temporary': 'Temporary'
    };
    return types[type] || type;
  };

  // Type-safe property access
  const getCompany = (job: PostedJob | ScrapedJob): string => {
    if ('company' in job) return job.company || 'Company not specified';
    return 'Company not specified';
  };

  const getPostedAt = (job: PostedJob | ScrapedJob): string | null => {
    if ('posted_at' in job) return job.posted_at;
    return job.created_at;
  };

  const getDeadline = (job: PostedJob | ScrapedJob): string | null => {
    if ('application_deadline' in job) return job.application_deadline || null;
    return null;
  };

  const getTags = (job: PostedJob | ScrapedJob): string[] => {
    if ('skills' in job && job.skills) return job.skills;
    return [];
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{job.location || 'Location not specified'}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          <span>{getCompany(job)}</span>
        </div>
        
        {job.job_type && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <Badge variant="secondary" className="text-xs">
              {getJobTypeLabel(job.job_type)}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {getPostedAt(job) && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Posted: {formatDate(getPostedAt(job))}</span>
          </div>
        )}
        
        {getDeadline(job) && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Deadline: {formatDate(getDeadline(job))}</span>
          </div>
        )}
      </div>

      {getTags(job).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {getTags(job).slice(0, 3).map((tag: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {getTags(job).length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{getTags(job).length - 3} more
            </Badge>
          )}
        </div>
      )}

      {socialShares && Object.keys(socialShares).length > 0 && (
        <div className="text-xs text-muted-foreground">
          Shared {Object.values(socialShares).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0)} times
        </div>
      )}
    </div>
  );
};

export default JobMetadata;
