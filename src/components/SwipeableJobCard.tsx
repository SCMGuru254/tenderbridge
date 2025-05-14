import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, BriefcaseIcon, BookmarkIcon, Share2, ExternalLink } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { cleanJobTitle } from "@/utils/cleanJobTitle";
import type { JobType } from "@/types/jobs";

interface SwipeableJobCardProps {
  job: {
    id: string;
    title: string;
    company: string | null;
    location: string | null;
    job_type: string | null;
    category: string | null;
    job_url: string | null;
    application_deadline: string | null;
    social_shares: Record<string, any>;
  };
  onSave: () => void;
  onShare: () => void;
  onApply?: () => void;
}

export function SwipeableJobCard({ job, onSave, onShare, onApply }: SwipeableJobCardProps) {
  const isMobile = useIsMobile();
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const [swipeAction, setSwipeAction] = useState<'none' | 'save' | 'share' | 'apply'>('none');
  const cardRef = useRef<HTMLDivElement>(null);

  // Reset swipe state when touch ends
  const resetSwipe = () => {
    setStartX(null);
    setCurrentX(null);
    setSwipeAction('none');
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0)';
    }
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartX(e.touches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || startX === null) return;
    
    const x = e.touches[0].clientX;
    setCurrentX(x);
    
    const deltaX = x - startX;
    
    // Limit the swipe distance
    const maxSwipe = 100;
    const limitedDelta = Math.max(Math.min(deltaX, maxSwipe), -maxSwipe);
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${limitedDelta}px)`;
    }
    
    // Determine swipe action based on direction and distance
    if (limitedDelta > 50) {
      setSwipeAction('save');
    } else if (limitedDelta < -50) {
      setSwipeAction('share');
    } else {
      setSwipeAction('none');
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isMobile || startX === null || currentX === null) {
      resetSwipe();
      return;
    }
    
    const deltaX = currentX - startX;
    
    // Execute action based on swipe direction
    if (deltaX > 50 && onSave) {
      onSave();
    } else if (deltaX < -50 && onShare) {
      onShare();
    }
    
    resetSwipe();
  };

  // Add swipe hint overlay
  const renderSwipeHint = () => {
    if (swipeAction === 'none' || !isMobile) return null;
    
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-opacity-70 rounded-lg ${swipeAction === 'save' ? 'bg-green-500' : 'bg-blue-500'}`}>
        <span className="text-white font-bold text-lg">
          {swipeAction === 'save' ? 'Save Job' : 'Share Job'}
        </span>
      </div>
    );
  };

  // Handle job click
  const handleJobClick = () => {
    if (job.job_url && onApply) {
      onApply();
    }
  };

  return (
    <Card 
      ref={cardRef}
      className="relative overflow-hidden transition-transform touch-manipulation hover:shadow-lg"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleJobClick}
    >
      {renderSwipeHint()}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{typeof cleanJobTitle === 'function' ? cleanJobTitle(job.title) : job.title}</CardTitle>
        <div className="flex items-center text-muted-foreground text-sm">
          <Building2 className="h-4 w-4 mr-1" />
          <span>{job.company || "Company not specified"}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-sm">
            {job.location && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
            )}
            {job.job_type && (
              <div className="flex items-center">
                <BriefcaseIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>{job.job_type}</span>
              </div>
            )}
          </div>
          
          {job.category && <Badge variant="outline" className="text-xs">{job.category}</Badge>}
          
          <div className="flex items-center justify-between mt-2">
            {job.job_url && (
              <div className="text-xs text-primary flex items-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span>Apply</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              <p className="italic">Swipe right to save, left to share</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}