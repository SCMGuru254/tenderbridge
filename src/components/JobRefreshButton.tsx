
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobRefreshButtonProps {
  onRefreshComplete: () => void;
}

export const JobRefreshButton = ({ onRefreshComplete }: JobRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshJobs = async () => {
    try {
      setIsRefreshing(true);
      setRefreshStatus("Wacha nicheki kazi mpya...");
      
      toast({
        title: "Refreshing jobs...",
        description: "This may take up to a minute while we fetch the latest jobs from multiple sources.",
      });

      // Call the Edge Function to scrape jobs
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: { refreshAll: true },
      });
      
      if (error) {
        console.error('Error refreshing jobs:', error);
        toast({
          variant: "destructive",
          title: "Error refreshing jobs",
          description: "There was a problem fetching the latest jobs. Please try again later.",
        });
      } else {
        console.log('Jobs refreshed successfully:', data);
        // Refetch the jobs to show the newly scraped ones
        onRefreshComplete();
        toast({
          title: "Jobs refreshed!",
          description: `${data.message}. Showing the latest supply chain jobs in Kenya.`,
        });
      }
    } catch (error) {
      console.error('Exception when refreshing jobs:', error);
      toast({
        variant: "destructive",
        title: "Error refreshing jobs",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsRefreshing(false);
      setRefreshStatus(null);
    }
  };

  return (
    <Button 
      onClick={refreshJobs} 
      disabled={isRefreshing}
      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
    >
      {isRefreshing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {refreshStatus || "Tunasaka kazi..."}
        </>
      ) : (
        <>
          <RefreshCcw className="h-4 w-4" />
          Refresh Jobs
        </>
      )}
    </Button>
  );
};
