
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

  // View job details handler
  const handleViewDetails = () => {
    // For all imported/scraped jobs with URLs, go directly to the job URL
    if (job_url) {
      window.open(job_url, '_blank');
    } else {
      // Only use the details page for jobs without external URLs
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-xl mb-1">{cleanJobTitle(title)}</CardTitle>
            <div className="flex items-center text-muted-foreground">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{company || "Company not specified"}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{location}</span>
              </div>
            )}
            {job_type && (
              <div className="flex items-center text-sm">
                <BriefcaseIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{job_type}</span>
              </div>
            )}
            {remainingTime && (
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{remainingTime}</span>
              </div>
            )}
          </div>
          
          {category && <Badge variant="outline">{category}</Badge>}
          
          <div className="flex items-center justify-between pt-2">
            <Button onClick={handleViewDetails}>
              {job_url ? (
                <>
                  Apply
                  <ExternalLink className="ml-1 h-4 w-4" />
                </>
              ) : (
                "View Details"
              )}
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleShare} disabled={isSharing}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share job</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveJob} variant={jobStatus.saved ? "default" : "outline"}>
              {jobStatus.saved ? "Unsave" : "Save"}
            </Button>
            <Button onClick={handleMarkAsApplied} variant={jobStatus.applied ? "default" : "outline"}>
              {jobStatus.applied ? "Undo Applied" : "Mark as Applied"}
            </Button>
            <Button onClick={handleRemindLater} variant={jobStatus.remindLater ? "default" : "outline"}>
              {jobStatus.remindLater ? "Remove Reminder" : "Remind Me Later"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
