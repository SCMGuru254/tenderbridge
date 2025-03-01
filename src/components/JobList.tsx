
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
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
          />
        ))}
      </div>
      
      {/* External Job Widget Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">More Jobs For You</h2>
        <div className="flex justify-center">
          <ExternalJobWidget />
        </div>
      </div>
    </div>
  );
};
