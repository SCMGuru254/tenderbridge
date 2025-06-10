
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobCardHeader } from "./JobCardHeader";
import { JobCardActions } from "./JobCardActions";
import JobMetadata from "./JobMetadata";

export interface JobCardProps {
  title: string;
  company: string | null;
  location: string | null;
  job_type?: string | null;
  category?: string | null;
  job_url?: string | null;
  application_deadline?: string | null;
  social_shares?: Record<string, any>;
}

const JobCard = ({ 
  title, 
  company, 
  location, 
  job_type, 
  category,
  job_url,
  application_deadline,
  social_shares 
}: JobCardProps) => {
  // Create a mock job object that matches our types
  const mockJob = {
    id: '1',
    title,
    job_type,
    created_at: new Date().toISOString(),
    location,
    company,
    application_deadline,
    social_shares
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <JobCardHeader 
          title={title} 
          company={company || "Company"} 
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {job_type && (
            <Badge variant="secondary" className="text-xs">
              {job_type}
            </Badge>
          )}
          {category && (
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          )}
          {location && (
            <Badge variant="outline" className="text-xs">
              {location}
            </Badge>
          )}
        </div>
        
        <JobMetadata 
          job={mockJob as any}
          socialShares={social_shares || {}}
        />
        
        <JobCardActions 
          jobUrl={job_url || null} 
          isExternalUrl={!!job_url}
          category={category || 'Unknown'}
        />
      </CardContent>
    </Card>
  );
};

export default JobCard;
