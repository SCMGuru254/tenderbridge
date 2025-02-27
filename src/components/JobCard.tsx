
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, BriefcaseIcon, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface JobCardProps {
  title: string;
  company: string | null;
  location: string | null;
  type: string | null;
  category: string | null;
  jobUrl?: string | null;
}

export const JobCard = ({ title, company, location, type, category, jobUrl }: JobCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  const handleApply = () => {
    if (jobUrl) {
      window.open(jobUrl, "_blank");
    } else {
      navigate(`/jobs/apply`);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setCopying(true);
      
      // Format job details for sharing
      const jobDetails = 
        `Job Title: ${title}\n` +
        `Company: ${company || 'Not specified'}\n` +
        `Location: ${location || 'Not specified'}\n` +
        (jobUrl ? `Apply here: ${jobUrl}` : 'Check the job board for more details.');
      
      // Use navigator.share if available (mobile devices)
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
        // Fallback to clipboard
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

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
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
          <div className="flex justify-between items-center">
            {category && (
              <div className="flex space-x-2">
                <Badge variant="secondary">{category}</Badge>
              </div>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleShare} 
              className="px-2"
              disabled={copying}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
