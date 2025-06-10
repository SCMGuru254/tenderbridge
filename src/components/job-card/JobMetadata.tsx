
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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{job.location || 'Location not specified'}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          <span>{job.company || 'Company not specified'}</span>
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
        {job.posted_at && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Posted: {formatDate(job.posted_at)}</span>
          </div>
        )}
        
        {job.deadline && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
        )}
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {job.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.tags.length - 3} more
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
