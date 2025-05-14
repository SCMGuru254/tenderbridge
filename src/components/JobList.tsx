
import { Loader2 } from "lucide-react";
import { JobCard } from "@/components/job-card/JobCard";
import { SwipeableJobCard } from "@/components/SwipeableJobCard";
import { ExternalJobWidget } from "@/components/ExternalJobWidget";
import { PostedJob, ScrapedJob } from "@/types/jobs";
import { getCompanyName, getLocation, getJobUrl, getJobSource, getDeadline, getRemainingTime } from "@/utils/jobUtils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface JobListProps {
  jobs: (PostedJob | ScrapedJob)[] | undefined;
  isLoading: boolean;
}

export const JobList = ({ jobs, isLoading }: JobListProps) => {
  const isMobile = useIsMobile();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No jobs found matching your criteria
      </div>
    );
  }

  // Only filter out jobs with severe formatting issues
  const filteredJobs = jobs.filter(job => {
    // Skip jobs without critical information
    if (!job.title || (job.title.trim() === '')) {
      return false;
    }
    
    // Remove Fuzu jobs as they have formatting issues
    if ((job as ScrapedJob)?.source?.toLowerCase()?.includes('fuzu')) {
      return false;
    }
    
    return true;
  });

  // Sort by creation date (most recent first)
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Get job sources information
  const jobsBySource = sortedJobs.reduce((acc, job) => {
    const source = getJobSource(job);
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(job);
    return acc;
  }, {} as Record<string, (PostedJob | ScrapedJob)[]>);

  // Display sources to help with debugging
  console.log("Original job sources:", 
    Object.entries(jobsBySource).map(([source, jobs]) => 
      `${source}: ${jobs.length} jobs`
    )
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Source Statistics */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Job Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(jobsBySource).map(([source, sourceJobs]) => (
              <Badge key={source} variant="outline" className="px-3 py-1">
                {source}: {sourceJobs.length} job{sourceJobs.length !== 1 ? 's' : ''}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedJobs.map((job) => (
          isMobile ? (
            <SwipeableJobCard
              key={job.id}
              job={{
                id: job.id,
                title: job.title,
                company: getCompanyName(job),
                location: getLocation(job),
                job_type: job.job_type,
                category: getJobSource(job),
                job_url: getJobUrl(job),
                application_deadline: getDeadline(job),
                social_shares: job.social_shares || {}
              }}
              onSave={() => {
                toast.success("Job saved to favorites");
                // Implement save functionality
              }}
              onShare={() => {
                toast.success("Job shared");
                // Implement share functionality
              }}
            />
          ) : (
            <JobCard
              key={job.id}
              title={job.title}
              company={getCompanyName(job)}
              location={getLocation(job)}
              type={job.job_type}
              category={getJobSource(job)}
              jobUrl={getJobUrl(job)}
              deadline={getDeadline(job)}
              remainingTime={getRemainingTime(job)}
              jobId={job.id}
              fullJob={job} // Pass the full job object for sharing
            />
          )
        ))}
      </div>
      
      {/* External Job Widget Section - Full width for better responsiveness */}
      <div className="mt-12 pt-8 border-t border-gray-200 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">More Jobs For You</h2>
        <ExternalJobWidget />
      </div>
    </div>
  );
};

