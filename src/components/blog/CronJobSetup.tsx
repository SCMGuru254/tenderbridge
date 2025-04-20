
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const CronJobSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const setupCronJobs = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('setup-cron-job');
      
      if (error) {
        console.error('Error setting up cron jobs:', error);
        toast.error("Failed to set up automated maintenance jobs");
        return;
      }
      
      console.log('Cron jobs setup response:', data);
      
      if (data.success) {
        toast.success("Automated maintenance jobs have been set up successfully");
        setHasRun(true);
        
        // Store in local storage that we've run this
        localStorage.setItem('cronJobsSetup', 'true');
      } else {
        toast.error("Failed to set up automated maintenance jobs: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error('Exception setting up cron jobs:', error);
      toast.error("An error occurred while setting up maintenance jobs");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we've already run this
  useEffect(() => {
    const hasRunBefore = localStorage.getItem('cronJobsSetup') === 'true';
    if (hasRunBefore) {
      setHasRun(true);
    } else {
      // Auto-run on first load
      setupCronJobs();
    }
  }, []);

  return (
    <div className="hidden">
      {/* This component is invisible but handles cron job setup */}
    </div>
  );
};
