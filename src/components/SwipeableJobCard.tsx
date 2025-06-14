import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Heart, ExternalLink } from "lucide-react";
import { analytics } from "@/utils/analytics";
import { performanceMonitor } from "@/utils/performanceMonitor";
import { errorHandler, ErrorType } from "@/utils/errorHandling";

interface SwipeableJobCardProps {
  job: {
    id: string;
    title: string;
    company: string | null;
    location: string | null;
    job_type?: string | null;
    category?: string;
    job_url?: string | null;
    application_deadline?: string | null;
    social_shares?: Record<string, any>;
  };
  onSave: () => void;
  onShare: () => void;
}

export function SwipeableJobCard({ job, onSave, onShare }: SwipeableJobCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    performanceMonitor.startMeasure('job-card-swipe');
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    analytics.trackUserAction('job-card-swipe-start', job.id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.touches[0].clientX;
    setCurrentX(currentTouch - startX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const swipeThreshold = 100;
    
    try {
      if (Math.abs(currentX) > swipeThreshold) {
        if (currentX > 0) {
          onSave();
          analytics.trackUserAction('job-saved', job.id);
        } else {
          onShare();
          analytics.trackUserAction('job-shared', job.id);
        }
      }
      
      setCurrentX(0);
      performanceMonitor.endMeasure('job-card-swipe');
    } // Fixed imports
    import { errorHandler, ErrorType } from "@/utils/errorHandling";
    import { performanceMonitor } from "@/utils/performanceMonitor";
    
    // Fixed error handling
    catch (error) {
      errorHandler.handleError(error, ErrorType.UNKNOWN);
    }
  };

  return (
    <div
      className="relative transition-transform duration-300 ease-out"
      style={{ transform: `translateX(${currentX}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
              <div className="flex items-center text-muted-foreground">
                <Building2 className="h-4 w-4 mr-1" />
                <span>{job.company || "Company not specified"}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {job.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.job_type && (
                <div className="flex items-center text-sm">
                  <Heart className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.job_type}</span>
                </div>
              )}
            </div>

            {job.category && <Badge variant="outline">{job.category}</Badge>}

            <div className="flex items-center justify-between pt-2">
              <a 
                href={job.job_url || undefined} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => analytics.trackUserAction('job-apply-click', job.id)}
              >
                <ExternalLink className="ml-1 h-4 w-4" />
                Apply
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
