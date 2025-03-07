import { useState } from "react";
import { Share2, Send, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface JobCardActionsProps {
  jobUrl: string | null;
  isExternalUrl: boolean;
  category: string | null;
  jobId?: string;
  fullJob?: any;
}

export const JobCardActions = ({
  jobUrl,
  isExternalUrl,
  category,
  jobId,
  fullJob
}: JobCardActionsProps) => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [copying, setCopying] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleViewDetails = () => {
    if (jobId) {
      navigate(`/jobs/details/${jobId}`, { state: { job: fullJob } });
    }
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (jobUrl) {
      if (isExternalUrl) {
        // If we have a direct job URL, open it in a new tab
        window.open(jobUrl, "_blank", "noopener,noreferrer");
        console.log("Opening external job URL:", jobUrl);
      } else {
        // Otherwise navigate to job details page
        navigate(`/jobs/details/${jobId}`, { state: { job: fullJob } });
      }
    } else {
      uiToast({
        variant: "destructive",
        title: "Cannot apply",
        description: "The job details are not available. Please try again later.",
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setCopying(true);
      
      const jobDetails = 
        `Job Title: ${fullJob?.title || 'Job'}\n` +
        `Company: ${fullJob?.company || fullJob?.companies?.name || 'Not specified'}\n` +
        `Location: ${fullJob?.location || fullJob?.companies?.location || 'Not specified'}\n` +
        (jobUrl ? `Apply here: ${jobUrl}` : 'Check the job board for more details.');
      
      if (navigator.share) {
        await navigator.share({
          title: `Supply Chain Job: ${fullJob?.title || 'Job'}`,
          text: jobDetails,
          url: window.location.href,
        });
        uiToast({
          title: "Job shared successfully",
          description: "Job details have been shared",
        });
      } else {
        await navigator.clipboard.writeText(jobDetails);
        uiToast({
          title: "Job details copied",
          description: "Job details have been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing job:', error);
      uiToast({
        variant: "destructive",
        title: "Error sharing job",
        description: "Failed to share job details",
      });
    } finally {
      setCopying(false);
    }
  };

  const handleSocialShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!fullJob) {
      uiToast({
        variant: "destructive",
        title: "Error sharing job",
        description: "Job details are not available for sharing",
      });
      return;
    }
    
    try {
      setSharing(true);
      
      const { data, error } = await supabase.functions.invoke('share-job', {
        body: fullJob,
      });
      
      if (error) throw error;
      
      if (data.success) {
        uiToast({
          title: "Job shared to social media",
          description: `Successfully shared to ${[
            data.twitter ? 'Twitter' : '',
            data.telegram ? 'Telegram' : ''
          ].filter(Boolean).join(' and ')}`,
        });
      } else {
        throw new Error(data.errors?.join(', ') || 'Failed to share job');
      }
    } catch (error: any) {
      console.error('Error sharing job to social media:', error);
      uiToast({
        variant: "destructive",
        title: "Error sharing to social media",
        description: error.message || "Failed to share job details",
      });
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {category && <Badge variant="secondary">{category}</Badge>}
        </div>
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleShare} 
            className="px-2"
            disabled={copying}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          {fullJob && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleSocialShare} 
              className="px-2"
              disabled={sharing}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={handleApply}
        >
          {isExternalUrl ? (
            <>
              Apply Now <ExternalLink className="ml-1 h-4 w-4" />
            </>
          ) : (
            "Apply Now"
          )}
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none"
                onClick={handleViewDetails}
              >
                <Info className="h-4 w-4 mr-1" /> Details
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View full job details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

// Import the Badge component
import { Badge } from "@/components/ui/badge";
