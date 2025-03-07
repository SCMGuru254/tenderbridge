
import { Card, CardContent } from "@/components/ui/card";
import { JobCardHeader } from "./JobCardHeader";
import { JobMetadata } from "./JobMetadata";
import { JobCardActions } from "./JobCardActions";
import { hasExternalUrl } from "@/utils/jobUtils";

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
  const isExternalUrl = jobUrl ? hasExternalUrl(fullJob) : false;

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <JobCardHeader title={title} company={company} />
      <CardContent>
        <div className="space-y-4">
          <JobMetadata 
            location={location} 
            type={type} 
            remainingTime={remainingTime} 
          />
          
          <JobCardActions 
            jobUrl={jobUrl} 
            isExternalUrl={isExternalUrl} 
            category={category} 
            jobId={jobId}
            fullJob={fullJob} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
