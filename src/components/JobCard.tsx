import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, BriefcaseIcon, Share2, Clock, Send, ExternalLink, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JobCardProps {
  title: string;
  company: string | null;
  location: string | null;
  type: string | null;
  category: string | null;
  jobUrl?: string | null;
  deadline?: string | null;
  remainingTime?: string | null;
  jobId?: string;
  fullJob?: any; // The complete job object for sharing
}

export const JobCard = ({ 
  title, 
  company, 
  location, 
  type, 
  category, 
  jobUrl, 
  deadline, 
  remainingTime,
  jobId,
  fullJob
}: JobCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
      // If we have a direct job URL, open it in a new tab
      window.open(jobUrl, "_blank", "noopener,noreferrer");
    } else if (jobId) {
      // Otherwise navigate to job details page
      navigate(`/jobs/details/${jobId}`, { state: { job: fullJob } });
    } else {
      toast({
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
        `Job Title: ${title}\n` +
        `Company: ${company || 'Not specified'}\n` +
        `Location: ${location || 'Not specified'}\n` +
        (jobUrl ? `Apply here: ${jobUrl}` : 'Check the job board for more details.');
      
      if (navigator.share) {
        await navigator.share({
          title: `Supply Chain Job: ${title}`,
          text: jobDetails,
          url: window.location.href,
        });
        toast({
          title: "Job shared successfully",
          description: "Job details have been shared",
        });
      } else {
        await navigator.clipboard.writeText(jobDetails);
        toast({
          title: "Job details copied",
          description: "Job details have been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing job:', error);
      toast({
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
      toast({
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
        toast({
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
      toast({
        variant: "destructive",
        title: "Error sharing to social media",
        description: error.message || "Failed to share job details",
      });
    } finally {
      setSharing(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow relative" onClick={handleViewDetails}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {company && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            <span>{company}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{location}</span>
              </div>
            )}
            {type && (
              <div className="flex items-center space-x-1">
                <BriefcaseIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{type}</span>
              </div>
            )}
          </div>
          
          {remainingTime && (
            <div className="flex items-center space-x-1 text-amber-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Closing {remainingTime}</span>
            </div>
          )}
          
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
              {jobUrl ? (
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
      </CardContent>
    </Card>
  );
};
