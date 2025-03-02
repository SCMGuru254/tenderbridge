
import { Loader2 } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { ExternalJobWidget } from "@/components/ExternalJobWidget";
import { PostedJob, ScrapedJob } from "@/types/jobs";
import { getCompanyName, getLocation, getJobUrl, getJobSource, getDeadline, getRemainingTime } from "@/utils/jobUtils";

interface JobListProps {
  jobs: (PostedJob | ScrapedJob)[] | undefined;
  isLoading: boolean;
}

export const JobList = ({ jobs, isLoading }: JobListProps) => {
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

  // Display sources to help with debugging
  const sources = [...new Set(sortedJobs.map(job => {
    // Get the original source without formatting
    if ('source' in job && job.source) {
      return job.source;
    }
    return "Supply Chain Kenya";
  }))];
  
  console.log("Original job sources:", sources);
  
  // Display formatted sources
  const formattedSources = [...new Set(sortedJobs.map(job => getJobSource(job)))];
  console.log("Current job sources:", formattedSources);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedJobs.map((job) => (
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
