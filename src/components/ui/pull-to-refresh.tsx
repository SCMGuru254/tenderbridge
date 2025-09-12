
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => void | Promise<void>;
  threshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 100,
  className
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0]?.clientY || 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === 0 || window.scrollY > 0) return;

    const currentY = e.touches[0]?.clientY || 0;
    const diff = currentY - startY.current;

    if (diff > 0) {
      e.preventDefault();
      setPullDistance(Math.min(diff, threshold * 1.5));
      setIsPulling(diff > threshold);
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance > threshold) {
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
    startY.current = 0;
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gray-100 transition-all duration-300 ease-out"
          style={{ height: `${Math.min(pullDistance, threshold)}px` }}
        >
          <div className={cn(
            "text-sm text-gray-600 transition-all duration-300",
            isPulling && "text-primary font-medium"
          )}>
            {isPulling ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        </div>
      )}
      
      <div
        className="transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${Math.min(pullDistance, threshold)}px)` }}
      >
        {children}
      </div>
    </div>
  );
};
