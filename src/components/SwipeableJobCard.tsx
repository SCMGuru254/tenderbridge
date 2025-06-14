
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, ExternalLink, MapPin, Calendar, Building } from 'lucide-react';
import { motion, PanInfo } from 'framer-motion';
import { errorHandler } from '@/utils/errorHandling';

interface SwipeableJobCardProps {
  job: {
    id: string;
    title: string;
    company: string | null;
    location: string | null;
    job_type: string | null;
    category: string;
    job_url?: string | null;
    application_deadline?: string | null;
    social_shares?: Record<string, any>;
  };
  onSave: () => void;
  onShare: () => void;
}

export const SwipeableJobCard = ({ job, onSave, onShare }: SwipeableJobCardProps) => {
  const [dragOffset, setDragOffset] = useState(0);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    try {
      if (info.offset.x > threshold) {
        // Swipe right - save job
        onSave();
      } else if (info.offset.x < -threshold) {
        // Swipe left - share job
        onShare();
      }
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      console.error('Error handling swipe:', handledError.message);
    }
    
    setDragOffset(0);
  };

  const handleApply = () => {
    if (job.job_url) {
      window.open(job.job_url, '_blank');
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      onDragEnd={handleDragEnd}
      onDrag={(event, info) => setDragOffset(info.offset.x)}
      className="relative"
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
              {job.company && (
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">{job.company}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {job.job_type && (
              <Badge variant="secondary" className="text-xs">
                {job.job_type}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {job.category}
            </Badge>
            {job.location && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {job.location}
              </Badge>
            )}
          </div>
          
          {job.application_deadline && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="flex-1"
            >
              <Heart className="h-4 w-4 mr-1" />
              Save
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            
            {job.job_url && (
              <Button
                size="sm"
                onClick={handleApply}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Apply
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Swipe indicators */}
      {dragOffset > 50 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
          <Heart className="h-6 w-6" />
        </div>
      )}
      {dragOffset < -50 && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
          <Share2 className="h-6 w-6" />
        </div>
      )}
    </motion.div>
  );
};
