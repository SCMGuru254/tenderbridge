import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Building2, MapPin, BriefcaseIcon, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { cleanJobTitle } from "../utils/cleanJobTitle";
import { ReportSystem } from "./ReportSystem";
import { SocialShare } from "./SocialShare";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string | null;
    location: string | null;
    job_url: string | null;
    application_deadline?: string | null;
    job_type?: string;
    category?: string;
    social_shares?: Record<string, any>;
    source_posted_at?: string;
    created_at?: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();
  const [jobStatus, setJobStatus] = useState({
    saved: false,
    applied: false,
    remindLater: false,
  });
  
  const {
    title,
    company,
    location,
    job_url,
    application_deadline,
    job_type,
    category
  } = job;
  
  // Calculate remaining time if deadline exists
  const getRemainingTime = () => {
    if (!application_deadline) return null;
    
    const deadline = new Date(application_deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days`;
  };
  
  const remainingTime = getRemainingTime();

  // Get the actual time when job was posted from source
  const getPostedTime = () => {
    // Check if job has source_posted_at field (for scraped jobs)
    if (job.source_posted_at) {
      const postedDate = new Date(job.source_posted_at);
      const now = new Date();
      const diffTime = now.getTime() - postedDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      return `${diffDays} days ago`;
    }
    
    // Fallback to created_at if available
    if (job.created_at) {
      const createdDate = new Date(job.created_at);
      const now = new Date();
      const diffTime = now.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      return `${diffDays} days ago`;
    }

    return "Recently posted";
  };

  // View job details handler
  const handleViewDetails = () => {
    // For scraped jobs with external URLs, go directly to the source
    if (job_url && job_url.startsWith('http')) {
      window.open(job_url, '_blank', 'noopener,noreferrer');
    } else {
      // For internal jobs, navigate to details page
      navigate(`/jobs/${job.id}`);
    }
  };

  // Handle persistent state
  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check Saved status
      const { data: savedData } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('scraped_job_id', job.id)
        .maybeSingle(); // Use maybeSingle to avoid error if not found
      
      // Check Applied status
      const { data: appliedData } = await supabase
        .from('job_application_tracker')
        .select('status')
        .eq('user_id', user.id)
        .eq('scraped_job_id', job.id)
        .maybeSingle();

      setJobStatus({
        saved: !!savedData,
        applied: !!appliedData,
        remindLater: false // Reminder logic usually implies local or separate table, keeping local for now
      });
    };
    
    checkStatus();
  }, [job.id]);

  const handleSaveJob = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to save jobs");
      return;
    }

    try {
      if (jobStatus.saved) {
        // Unsave
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('scraped_job_id', job.id);
        if (error) throw error;
        toast.success("Job removed from saved list");
      } else {
        // Save
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ user_id: user.id, scraped_job_id: job.id });
        if (error) throw error;
        toast.success("Job saved successfully!");
      }
      setJobStatus(prev => ({ ...prev, saved: !prev.saved }));
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to update job status");
    }
  };

  const handleMarkAsApplied = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to track applications");
      return;
    }

    try {
      if (jobStatus.applied) {
        // Remove from tracker
        const { error } = await supabase
          .from('job_application_tracker')
          .delete()
          .eq('user_id', user.id)
          .eq('scraped_job_id', job.id);
        if (error) throw error;
        toast.success("Marked as not applied");
      } else {
        // Add to tracker
        const { error } = await supabase
          .from('job_application_tracker')
          .insert({ user_id: user.id, scraped_job_id: job.id, status: 'applied' });
        if (error) throw error;
        toast.success("Marked as applied!");
      }
      setJobStatus(prev => ({ ...prev, applied: !prev.applied }));
    } catch (error) {
      console.error("Error tracking application:", error);
      toast.error("Failed to update application status");
    }
  };

  const handleRemindLater = () => {
    // Keep local for now as no schema defined
    setJobStatus((prev) => ({ ...prev, remindLater: !prev.remindLater }));
    toast.success(jobStatus.remindLater ? "Reminder removed" : "Reminder set successfully!");
  };

  return (
    <Card className="hover:shadow-md transition-shadow w-full max-w-none mx-auto touch-manipulation">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg md:text-xl mb-1 line-clamp-2">{cleanJobTitle(title)}</CardTitle>
            <div className="flex items-center text-muted-foreground text-sm">
              <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{company || "Company not specified"}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm">
          {location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {job_type && (
            <div className="flex items-center">
              <BriefcaseIcon className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
              <span>{job_type}</span>
            </div>
          )}
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
            <span>Posted {getPostedTime()}</span>
          </div>
          {remainingTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
              <span>Deadline: {remainingTime}</span>
            </div>
          )}
        </div>
        
        {category && <Badge variant="outline" className="text-xs">{category}</Badge>}
        
        {/* Primary action button - full width on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch justify-between pt-2 gap-2 w-full">
          <Button 
            onClick={handleViewDetails} 
            className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-sm touch-manipulation"
          >
            {job_url && job_url.startsWith('http') ? (
              <>
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              "View Details"
            )}
          </Button>

          <SocialShare
            jobId={job.id}
            jobTitle={cleanJobTitle(title)}
            company={company || "Company"}
            className="w-12 h-12 sm:w-10 sm:h-10 touch-manipulation"
          />

          <ReportSystem 
            contentId={job.id} 
            contentType="job" 
            className="w-12 h-12 sm:w-10 sm:h-10 text-muted-foreground hover:text-red-500" 
          />
        </div>

        {/* Action buttons - stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleSaveJob} 
            variant={jobStatus.saved ? "default" : "outline"} 
            className="flex-1 h-12 sm:h-10 text-base sm:text-sm touch-manipulation"
          >
            {jobStatus.saved ? "Unsave" : "Save"}
          </Button>
          <Button 
            onClick={handleMarkAsApplied} 
            variant={jobStatus.applied ? "default" : "outline"} 
            className="flex-1 h-12 sm:h-10 text-base sm:text-sm touch-manipulation"
          >
            {jobStatus.applied ? "Undo Applied" : "Mark as Applied"}
          </Button>
          <Button 
            onClick={handleRemindLater} 
            variant={jobStatus.remindLater ? "default" : "outline"} 
            className="flex-1 h-12 sm:h-10 text-base sm:text-sm touch-manipulation"
          >
            {jobStatus.remindLater ? "Remove Reminder" : "Remind Me Later"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
