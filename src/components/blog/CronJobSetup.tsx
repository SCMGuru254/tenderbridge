
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const CronJobSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupCronJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Attempting to set up cron jobs...");
      
      const { data, error: functionError } = await supabase.functions.invoke('setup-cron-job');
      
      if (functionError) {
        console.error('Error setting up cron jobs:', functionError);
        setError(functionError.message || "Unknown error");
        toast.error("Failed to set up automated maintenance jobs. Please try again later.");
        return;
      }
      
      console.log('Cron jobs setup response:', data);
      
      if (data?.success) {
        toast.success("Automated maintenance jobs have been set up successfully");
        setHasRun(true);
        
        // Store in local storage that we've run this
        localStorage.setItem('cronJobsSetup', 'true');
      } else {
        const errorMessage = data?.error || "Unknown error";
        console.error("Failed to set up cron jobs:", errorMessage);
        setError(errorMessage);
        toast.error("Failed to set up automated maintenance jobs: " + errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      console.error('Exception setting up cron jobs:', error);
      setError(errorMessage);
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
      // Wait a moment before auto-running to ensure app is fully loaded
      const timer = setTimeout(() => {
        setupCronJobs();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Component is invisible but handles cron job setup
  return (
    <div className="hidden">
      {/* This component is invisible but handles cron job setup */}
      {error && <span data-error={error} />}
    </div>
  );
};
