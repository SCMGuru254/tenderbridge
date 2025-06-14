
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Building2 } from 'lucide-react';
import { useTouchEvents } from '@/utils/mobileOptimization';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  created_at: string;
  description?: string;
}

interface SwipeableJobCardProps {
  job: Job;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
}

const SwipeableJobCard: React.FC<SwipeableJobCardProps> = ({
  job,
  onSwipeLeft,
  onSwipeRight,
  onTap
}) => {
  const handleSwipeLeft = () => {
    onSwipeLeft?.();
  };

  const handleSwipeRight = () => {
    onSwipeRight?.();
  };

  const handleTap = () => {
    onTap?.();
  };

  const touchEvents = useTouchEvents(
    handleSwipeLeft,
    handleSwipeRight,
    undefined,
    undefined
  );

  return (
    <Card 
      className="w-full max-w-sm mx-auto touch-manipulation select-none"
      onClick={handleTap}
      {...touchEvents}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
          <Badge variant="secondary">{job.job_type}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Building2 className="h-4 w-4" />
          {job.company}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(job.created_at).toLocaleDateString()}
          </div>
          {job.description && (
            <p className="text-sm line-clamp-3 mt-2">{job.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SwipeableJobCard;
