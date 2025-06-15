
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, BriefcaseIcon, Share2, Clock, ExternalLink, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cleanJobTitle } from "@/utils/cleanJobTitle";
import { useAuth } from "@/contexts/AuthContext";

interface JobCardProps {
  title: string;
  company: string | null;
  location: string | null;
  job_url: string | null;
  application_deadline?: string | null;
  job_type?: string | null;
  category?: string;
  social_shares?: Record<string, any>;
  jobId?: string;
}

export default function JobCard({
  title,
  company,
  location,
  job_url,
  application_deadline,
  job_type,
  category,
  social_shares,
  jobId
}: JobCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
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
    if (job_url) {
      window.open(job_url, '_blank');
    } else if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };

  // Share job handler
  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this job: ${title} at ${company || 'Unknown Company'}`,
          url: job_url || window.location.href
        });
      } else {
        await navigator.clipboard.writeText(job_url || window.location.href);
        toast.success("Job link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing job:", error);
      toast.error("Failed to share job");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast.error("Please login to save jobs");
      navigate('/auth');
      return;
    }

    if (!jobId) {
      toast.error("Cannot save this job");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        // Remove from saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        if (error) throw error;
        setIsSaved(false);
        toast.success("Job removed from saved list");
      } else {
        // Add to saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId,
            status: 'saved'
          });

        if (error) throw error;
        setIsSaved(true);
        toast.success("Job saved successfully!");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job");
    } finally {
      setIsSaving(false);
    }
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
          {remainingTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
              <span>{remainingTime}</span>
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
            {job_url ? (
              <>
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              "View Details"
            )}
          </Button>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleSaveJob} 
                    disabled={isSaving}
                    className="w-12 h-12 sm:w-10 sm:h-10 touch-manipulation"
                  >
                    <Heart className={`h-5 w-5 sm:h-4 sm:w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSaved ? 'Remove from saved' : 'Save job'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
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
        </div>
      </CardContent>
    </Card>
  );
}
