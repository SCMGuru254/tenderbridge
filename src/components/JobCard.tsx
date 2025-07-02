
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Building2, MapPin, BriefcaseIcon, Share2, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cleanJobTitle } from "../utils/cleanJobTitle";

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
  };
}

export function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const [jobStatus, setJobStatus] = useState({ saved: false, applied: false, remindLater: false });
  
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
    if ('source_posted_at' in job && job.source_posted_at) {
      const postedDate = new Date(job.source_posted_at);
      const now = new Date();
      const diffTime = now.getTime() - postedDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      return `${diffDays} days ago`;
    }
    
    // Fallback to created_at
    const createdDate = new Date(job.created_at);
    const now = new Date();
    const diffTime = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
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

  // Share job handler
  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Increment share count
      const { error } = await supabase
        .from('scraped_jobs')
        .update({ 
          social_shares: { 
            ...job.social_shares,
            count: ((job.social_shares as any)?.count || 0) + 1 
          }
        })
        .eq('id', job.id);
      
      if (error) throw error;
      
      toast.success("Job shared successfully!");
    } catch (error) {
      console.error("Error sharing job:", error);
      toast.error("Failed to share job");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSaveJob = () => {
    setJobStatus((prev) => ({ ...prev, saved: !prev.saved }));
    toast.success(jobStatus.saved ? "Job removed from saved list" : "Job saved successfully!");
  };

  const handleMarkAsApplied = () => {
    setJobStatus((prev) => ({ ...prev, applied: !prev.applied }));
    toast.success(jobStatus.applied ? "Marked as not applied" : "Marked as applied!");
  };

  const handleRemindLater = () => {
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleShare} 
                  disabled={isSharing} 
                  className="w-12 h-12 sm:w-10 sm:h-10 touch-manipulation"
                >
                  <Share2 className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share job</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
