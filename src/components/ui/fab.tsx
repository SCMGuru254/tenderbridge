
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:hidden",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "flex items-center justify-center",
          className
        )}
        size="icon"
        {...props}
      >
        {children || <Plus className="h-6 w-6" />}
      </Button>
    );
  }
);

FAB.displayName = "FAB";
