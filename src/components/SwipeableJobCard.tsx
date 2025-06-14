
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Building2, Heart, Share2 } from 'lucide-react';
import { useTouchEvents } from '@/utils/mobileOptimization';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  category: string;
  job_url?: string;
  application_deadline?: string | null;
  social_shares: Record<string, any>;
}

interface SwipeableJobCardProps {
  job: Job;
  onSave?: () => void;
  onShare?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
}

const SwipeableJobCard: React.FC<SwipeableJobCardProps> = ({
  job,
  onSave,
  onShare,
  onSwipeLeft,
  onSwipeRight,
  onTap
}) => {
  const handleSwipeLeft = () => {
    onSwipeLeft?.();
  };

  const handleSwipeRight = () => {
    onSwipeRight?.();
    onSave?.();
  };

  const handleTap = () => {
    onTap?.();
    if (job.job_url) {
      window.open(job.job_url, '_blank');
    }
  };

  const touchEvents = useTouchEvents(
    handleSwipeLeft,
    handleSwipeRight,
    undefined,
    undefined
  );

  return (
    <Card 
      className="w-full max-w-sm mx-auto touch-manipulation select-none hover:shadow-lg transition-shadow"
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
            {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'No deadline'}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Badge variant="outline">{job.category}</Badge>
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onSave?.(); }}
                className="p-2 hover:bg-muted rounded-full"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onShare?.(); }}
                className="p-2 hover:bg-muted rounded-full"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwipeableJobCard;
