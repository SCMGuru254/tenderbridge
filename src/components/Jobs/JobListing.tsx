import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobs } from '@/hooks/useJobs';
import { formatDistance } from 'date-fns';
import { MapPin, Building, Clock, CreditCard } from 'lucide-react';
import type { Job } from '@/types/database';

interface JobListingProps {
  filters?: {
    location?: string;
    jobType?: Job['job_type'];
    experienceLevel?: Job['experience_level'];
    minSalary?: number;
    isRemote?: boolean;
    skills?: string[];
  };
  onJobClick?: (job: Job) => void;
}

export const JobListing: React.FC<JobListingProps> = ({
  filters,
  onJobClick
}) => {
  const {
    jobs,
    isLoading,
    error,
    hasMore,
    loadMore,
    totalCount
  } = useJobs({ filters, includeSkills: true });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading jobs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        // Loading skeletons
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-2/3 mb-4" />
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No jobs found matching your criteria</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {jobs.length} of {totalCount} jobs
          </p>
          
          {jobs.map(job => (
            <Card
              key={job.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onJobClick?.(job)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="mb-2">{job.title}</CardTitle>
                    <div className="flex items-center text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {job.company_name}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                        {job.is_remote && ' (Remote)'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {formatDistance(new Date(job.created_at), new Date(), { addSuffix: true })}
                    </p>
                    {(job.salary_min || job.salary_max) && (
                      <p className="flex items-center text-sm mt-1">
                        <CreditCard className="w-4 h-4 mr-1" />
                        {job.salary_min && job.salary_max
                          ? `${job.salary_currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                          : job.salary_min
                          ? `From ${job.salary_currency} ${job.salary_min.toLocaleString()}`
                          : `Up to ${job.salary_currency} ${job.salary_max!.toLocaleString()}`
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.job_type}</Badge>
                    {job.experience_level && (
                      <Badge variant="outline">{job.experience_level}</Badge>
                    )}
                    {job.is_remote && (
                      <Badge variant="default">Remote</Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description}
                  </p>

                  {job.job_skills && (
                    <div className="flex flex-wrap gap-2">
                      {job.job_skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={skill.is_required ? 'border-primary' : ''}
                        >
                          {skill.skill_name}
                          {skill.skill_level && ` (${skill.skill_level})`}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {hasMore && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => loadMore()}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More Jobs'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};