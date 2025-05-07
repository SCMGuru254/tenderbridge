
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Building2, MapPin, BriefcaseIcon, Share2, Clock, ExternalLink, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { hasExternalUrl } from "../utils/jobUtils";
import { ShareToSocial } from './ShareToSocial';
import type { Database } from "../integrations/supabase/types";

interface JobCardProps {
  job: Database["public"]["Tables"]["scraped_jobs"]["Row"];
}

export function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  
  const {
    title,
    company,
    location,
    job_url,
    application_deadline,
    job_type,
    category
  } = job;

  const isExternalJob = hasExternalUrl(job);
  
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
    if (isExternalJob && job_url) {
      window.open(job_url, '_blank');
    } else {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-xl mb-1">{title}</CardTitle>
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
              {isExternalJob ? (
                <>
                  View External Job
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
        </div>
      </CardContent>
    </Card>
  );
}
