import React, { useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface SwipeContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export function SwipeContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const threshold = 100; // minimum distance for swipe

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0]?.clientX || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const currentX = e.touches[0]?.clientX || 0;
    const diff = currentX - startX;

    // Limit the swipe distance
    const bounded = Math.max(Math.min(diff, 100), -100);
    setCurrentTranslate(bounded);

    containerRef.current.style.transform = `translateX(${bounded}px)`;
  };

  const handleTouchEnd = () => {
    if (!containerRef.current) return;

    // Reset position with animation
    containerRef.current.style.transition = 'transform 0.2s ease-out';
    containerRef.current.style.transform = 'translateX(0)';

    // Check if swipe distance meets threshold
    if (currentTranslate <= -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (currentTranslate >= threshold && onSwipeRight) {
      onSwipeRight();
    }

    // Reset state
    setCurrentTranslate(0);
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.transition = '';
      }
    }, 200);
  };

  return (
    <div className="relative overflow-hidden touch-pan-y">
      {/* Action buttons */}
      <div className="absolute inset-y-0 left-0 flex items-center px-4 opacity-30">
        {leftAction}
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 opacity-30">
        {rightAction}
      </div>

      {/* Swipeable content */}
      <div
        ref={containerRef}
        className={cn("touch-pan-y", className)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
