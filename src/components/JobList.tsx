
import { Loader2, Clock } from "lucide-react";
import JobCard from "@/components/job-card/JobCard";
import { SwipeableJobCard } from "@/components/SwipeableJobCard";
import { ExternalJobWidget } from "@/components/ExternalJobWidget";
import { PostedJob, AggregatedJob } from "@/types/jobs";
import { getCompanyName, getLocation, getJobUrl, getJobSource, getDeadline, getTimeSincePosted } from "@/utils/jobUtils";
import { cleanJobTitle, cleanCompanyName, cleanLocation } from "@/utils/cleanJobTitle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { PostgrestError } from "@supabase/supabase-js";

interface JobListProps {
  jobs: (PostedJob | AggregatedJob)[] | undefined;
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

  // ENHANCED FILTERING: Use word-based validation instead of character counting
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const filteredJobsByTime = (jobs || []).filter(job => {
    // Use source_posted_at if available, otherwise use created_at
    let dateToCheck: string | null = null;
    
    if ('source_posted_at' in job && job.source_posted_at) {
      dateToCheck = job.source_posted_at;
    } else {
      dateToCheck = job.created_at;
    }
    
    if (dateToCheck) {
      try {
        const jobDate = new Date(dateToCheck);
        const isRecent = jobDate >= thirtyDaysAgo && jobDate <= now;
        console.log(`Job "${job.title}" date check:`, {
          dateUsed: dateToCheck,
          parsed: jobDate.toISOString(),
          isRecent,
          daysAgo: Math.floor((now.getTime() - jobDate.getTime()) / (24 * 60 * 60 * 1000))
        });
        return isRecent;
      } catch (error) {
        console.error('Error parsing job date:', dateToCheck, error);
        return true;
      }
    }
    
    console.log(`Job "${job.title}" has no valid date, including it`);
    return true;
  });

  console.log("JobList - After time filtering:", filteredJobsByTime.length, "jobs remain from", jobs.length, "total");

  // Enhanced validation with word-based filtering
  const filteredJobs = filteredJobsByTime.filter(job => {
    console.log("JobList - Processing job:", job.title || 'NO TITLE', "from source:", getJobSource(job));
    
    // Clean the title first and validate it's not empty
    const cleanedTitle = cleanJobTitle(job.title || '');
    
    // ENHANCED RULE: Word-based validation instead of character counting
    if (!cleanedTitle || cleanedTitle.trim().length < 3) {
      console.log("🚫 JobList - Filtering out job with invalid title:", job);
      return false;
    }
    
    // Check for meaningful words in the title (at least 2 words with 2+ letters each)
    const titleWords = cleanedTitle.trim().split(/\s+/).filter(word => 
      word.length >= 2 && /^[a-zA-Z]/.test(word)
    );
    
    if (titleWords.length < 2) {
      console.log("🚫 JobList - Filtering out job without sufficient meaningful words:", cleanedTitle);
      return false;
    }
    
    // Check for placeholder patterns in titles
    const invalidTitlePatterns = [
      /^\*+$/,                          // Only asterisks
      /\*{2,}/,                         // Multiple asterisks
      /^[\*\-\s]+$/,                    // Only asterisks, dashes, spaces
      /^\s*[\*\-]+\s*[\(\)]*\s*$/,     // Asterisks/dashes with parentheses
      /^null$/i,                        // literal "null"
      /^undefined$/i,                   // literal "undefined"
      /Job\s*Title\s*Not\s*Available/i, // Generic placeholder
      /^test\s*job$/i,                  // Test entries
      /^sample\s*job$/i,                // Sample entries
    ];
    
    if (invalidTitlePatterns.some(pattern => pattern.test(cleanedTitle))) {
      console.log("🚫 JobList - Filtering out job with placeholder title:", cleanedTitle);
      return false;
    }
    
    // Validate company name if present
    const company = getCompanyName(job);
    if (company) {
      const cleanedCompany = cleanCompanyName(company);
      const invalidCompanyPatterns = [
        /^\*+$/,
        /\*{2,}/,
        /^[\*\-\s]+$/,
        /Company\s*not\s*specified/i,
        /^test\s*company$/i,
        /^sample\s*company$/i,
      ];
      
      if (invalidCompanyPatterns.some(pattern => pattern.test(cleanedCompany))) {
        console.log("🚫 JobList - Filtering out job with placeholder company:", cleanedCompany);
        return false;
      }
    }
    
    // Validate location if present
    const location = getLocation(job);
    if (location) {
      const cleanedLocation = cleanLocation(location);
      const invalidLocationPatterns = [
        /^\*+$/,
        /\*{2,}/,
        /^[\*\-\s]+$/,
      ];
      
      if (invalidLocationPatterns.some(pattern => pattern.test(cleanedLocation))) {
        console.log("🚫 JobList - Filtering out job with placeholder location:", cleanedLocation);
        return false;
      }
    }
    
    // All validations passed
    return true;
  });

  console.log("JobList - Final filtered jobs count:", filteredJobs.length);
  console.log("JobList - Original jobs count:", jobs.length);
  console.log("JobList - Filtered out:", jobs.length - filteredJobs.length, "invalid jobs");
  
  if (filteredJobs.length > 0) {
    console.log("JobList - Sample filtered jobs:", filteredJobs.slice(0, 3).map(j => ({ 
      title: cleanJobTitle(j.title || ''), 
      company: cleanCompanyName(getCompanyName(j) || ''), 
      source: getJobSource(j), 
      posted: getTimeSincePosted(j) 
    })));
  }

  // If no valid jobs after filtering, show appropriate message
  if (filteredJobs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No valid jobs found</h3>
        <p>All jobs contained placeholder or invalid data. Please try refreshing to get new job listings.</p>
      </div>
    );
  }

  // Sort by the most appropriate date (source_posted_at preferred, then created_at)
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const getValidDate = (job: PostedJob | AggregatedJob) => {
      const dateToUse = ('source_posted_at' in job && job.source_posted_at) 
        ? job.source_posted_at 
        : job.created_at;
      return typeof dateToUse === 'string' ? new Date(dateToUse) : new Date();
    };
    
    const aDate = getValidDate(a);
    const bDate = getValidDate(b);
    return bDate.getTime() - aDate.getTime();
  });

  // Get job sources information
  const jobsBySource = sortedJobs.reduce((acc, job) => {
    const source = getJobSource(job);
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(job);
    return acc;
  }, {} as Record<string, (PostedJob | AggregatedJob)[]>);

  // Display sources to help with debugging
  console.log("JobList - Valid job sources:", 
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
            Valid Job Listings ({sortedJobs.length} total jobs from {Object.keys(jobsBySource).length} sources)
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
              No valid jobs found. All jobs contained placeholder or invalid data.
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
          
          // Clean the job data before displaying with enhanced validation
          const cleanedTitle = cleanJobTitle(job.title || '');
          const cleanedCompany = cleanCompanyName(company || '') || "Company details available on site";
          const cleanedLocation = cleanLocation(location || '') || "Kenya";
          
          // Convert to string | null instead of string | undefined for JobCard compatibility
          const deadlineValue: string | null = deadline || null;
          const jobUrlValue: string | null = jobUrl || null;
          
          console.log(`JobList - Rendering job ${index + 1}:`, {
            title: cleanedTitle,
            company: cleanedCompany,
            location: cleanedLocation,
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
                company: cleanedCompany,
                location: cleanedLocation,
                job_type: job.job_type || "Type not specified",
                category: getJobSource(job),
                job_url: jobUrlValue || undefined,
                application_deadline: deadlineValue || undefined,
                social_shares: job.social_shares || {}
              }}
              onSave={() => {
                console.log("Job saved to favorites");
              }}
              onShare={() => {
                console.log("Job shared");
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
                location={cleanedLocation}
                job_type={job.job_type || undefined}
                category={getJobSource(job)}
                job_url={jobUrlValue}
                application_deadline={deadlineValue}
                jobId={job.id}
              />
            </div>
          );
        })}
      </div>
      
      {/* External Job Widget Section - Full width for better responsiveness */}
      <div className="mt-12 pt-8 border-t border-gray-200 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">More Professional Jobs For You</h2>
        <ExternalJobWidget />
      </div>
    </div>
  );
};
