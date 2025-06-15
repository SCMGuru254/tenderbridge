
import { Loader2, Clock } from "lucide-react";
import JobCard from "@/components/job-card/JobCard";
import { SwipeableJobCard } from "@/components/SwipeableJobCard";
import { ExternalJobWidget } from "@/components/ExternalJobWidget";
import { PostedJob, ScrapedJob } from "@/types/jobs";
import { getCompanyName, getLocation, getJobUrl, getJobSource, getDeadline, getTimeSincePosted } from "@/utils/jobUtils";
import { cleanJobTitle, cleanCompanyName } from "@/utils/cleanJobTitle";
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
        <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No recent jobs found</h3>
        <p>Try adjusting your filters or check back later for new job postings.</p>
      </div>
    );
  }

  // More lenient filtering - only filter out jobs with completely missing essential data
  const filteredJobs = jobs.filter(job => {
    console.log("JobList - Processing job:", job.title || 'NO TITLE', "from source:", getJobSource(job));
    
    // Clean the title first; ENSURE job.title is always a string
    const cleanedTitle = cleanJobTitle(job.title || '');
    
    // Only skip jobs that are completely unusable even after cleaning
    if (!cleanedTitle || cleanedTitle === 'Job Title Not Available') {
      console.log("JobList - Filtering out job without valid title:", job);
      return false;
    }
    
    // Keep all jobs including Fuzu - don't filter them out
    return true;
  });

  console.log("JobList - Filtered jobs count:", filteredJobs.length);
  console.log("JobList - Original jobs count:", jobs.length);
  console.log("JobList - Sample filtered jobs:", filteredJobs.slice(0, 3).map(j => ({ title: cleanJobTitle(j.title || ''), company: getCompanyName(j), source: getJobSource(j), posted: getTimeSincePosted(j) })));

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
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Job Listings ({sortedJobs.length} total jobs)
          </CardTitle>
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
              No recent jobs found. Try adjusting the date filter or check back later.
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
          const timeSincePosted = getTimeSincePosted(job);
          
          // Clean the job data before displaying - ENSURE job.title is always a string
          const cleanedTitle = cleanJobTitle(job.title || '');
          const cleanedCompany = cleanCompanyName(company || '');
          
          // Convert null to undefined to match expected type
          const deadlineValue: string | undefined = deadline ?? undefined;
          const jobUrlValue: string | undefined = jobUrl ?? undefined;
          
          console.log(`JobList - Rendering job ${index + 1}:`, {
            title: cleanedTitle,
            company: cleanedCompany,
            location,
            source: getJobSource(job),
            deadline: deadlineValue,
            posted: timeSincePosted
          });
          
          return isMobile ? (
            <SwipeableJobCard
              key={job.id}
              job={{
                id: job.id,
                title: cleanedTitle,
                company: cleanedCompany || "Company not specified",
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
            <div key={job.id} className="relative">
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeSincePosted}
                </Badge>
              </div>
              <JobCard
                title={cleanedTitle}
                company={cleanedCompany}
                location={location}
                job_type={job.job_type || null}
                category={getJobSource(job)}
                job_url={jobUrlValue}
                application_deadline={deadlineValue}
                social_shares={job.social_shares || {}}
              />
            </div>
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
