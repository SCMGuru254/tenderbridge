import { Loader2 } from "lucide-react";
import JobCard from "@/components/job-card/JobCard";
import { SwipeableJobCard } from "@/components/SwipeableJobCard";
import { ExternalJobWidget } from "@/components/ExternalJobWidget";
import { PostedJob, ScrapedJob } from "@/types/jobs";
import { getCompanyName, getLocation, getJobUrl, getJobSource, getDeadline } from "@/utils/jobUtils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

interface JobListProps {
  jobs: (PostedJob | ScrapedJob)[] | undefined;
  isLoading: boolean;
  error?: PostgrestError | null;
}

export const JobList = ({ jobs, isLoading, error }: JobListProps) => {
  const isMobile = useIsMobile();
  
  console.log("JobList - jobs received:", jobs);
  console.log("JobList - isLoading:", isLoading);
  console.log("JobList - jobs length:", jobs?.length);
  console.log("JobList - error:", error);
  
  if (isLoading) {
    console.log("JobList - Showing loading state");
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.log("JobList - Showing error state");
    return (
      <Card className="mt-8 text-center">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn't fetch the job listings at this time.</p>
          <p className="text-sm text-muted-foreground mt-2">Please try refreshing, or check back later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!jobs || jobs.length === 0) {
    console.log("JobList - No jobs to display, jobs:", jobs);
    return (
      <div className="text-center text-gray-500 py-12">
        No jobs found matching your criteria
      </div>
    );
  }

  // More lenient filtering - only filter out jobs with completely missing essential data
  const filteredJobs = jobs.filter(job => {
    console.log("JobList - Processing job:", job.title || 'NO TITLE', "from source:", getJobSource(job));
    
    // Only skip jobs that are completely unusable
    if (!job.title || job.title.trim() === '' || job.title.toLowerCase() === 'null') {
      console.log("JobList - Filtering out job without valid title:", job);
      return false;
    }
    
    // Keep all jobs including Fuzu - don't filter them out
    return true;
  });

  console.log("JobList - Filtered jobs count:", filteredJobs.length);
  console.log("JobList - Original jobs count:", jobs.length);
  console.log("JobList - Sample filtered jobs:", filteredJobs.slice(0, 3).map(j => ({ title: j.title, company: getCompanyName(j), source: getJobSource(j) })));

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
  console.log("JobList - Job sources:", 
    Object.entries(jobsBySource).map(([source, jobs]) => 
      `${source}: ${jobs.length} jobs`
    )
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Source Statistics */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Job Sources ({sortedJobs.length} total jobs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(jobsBySource).map(([source, sourceJobs]) => (
              <Badge key={source} variant="outline" className="px-3 py-1">
                {source}: {sourceJobs.length} job{sourceJobs.length !== 1 ? 's' : ''}
              </Badge>
            ))}
          </div>
          {sortedJobs.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              No jobs are being displayed. Check console for filtering details.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedJobs.map((job, index) => {
          const deadline = getDeadline(job);
          const jobUrl = getJobUrl(job);
          const company = getCompanyName(job);
          const location = getLocation(job);
          
          // Convert null to undefined to match expected type
          const deadlineValue: string | undefined = deadline ?? undefined;
          const jobUrlValue: string | undefined = jobUrl ?? undefined;
          
          console.log(`JobList - Rendering job ${index + 1}:`, {
            title: job.title,
            company,
            location,
            source: getJobSource(job),
            deadline: deadlineValue
          });
          
          return isMobile ? (
            <SwipeableJobCard
              key={job.id}
              job={{
                id: job.id,
                title: job.title,
                company: company || "Company not specified",
                location: location || "Location not specified",
                job_type: job.job_type || "Type not specified",
                category: getJobSource(job),
                job_url: jobUrlValue,
                application_deadline: deadlineValue,
                social_shares: job.social_shares || {}
              }}
              onSave={() => {
                toast.success("Job saved to favorites");
              }}
              onShare={() => {
                toast.success("Job shared");
              }}
            />
          ) : (
            <JobCard
              key={job.id}
              title={job.title}
              company={company}
              location={location}
              job_type={job.job_type || null}
              category={getJobSource(job)}
              job_url={jobUrlValue}
              application_deadline={deadlineValue}
              social_shares={job.social_shares || {}}
            />
          );
        })}
      </div>
      
      {/* External Job Widget Section - Full width for better responsiveness */}
      <div className="mt-12 pt-8 border-t border-gray-200 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">More Jobs For You</h2>
        <ExternalJobWidget />
      </div>
    </div>
  );
};
