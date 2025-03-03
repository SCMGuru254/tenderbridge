
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobRefreshButtonProps {
  onRefreshComplete: () => void;
}

export const JobRefreshButton = ({ onRefreshComplete }: JobRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const { toast } = useToast();

  // Make sure this matches the sources in the jobSites.ts file
  const sources = [
    { id: "all", name: "All Sources" },
    { id: "LinkedIn", name: "LinkedIn" },
    { id: "BrighterMonday", name: "Brighter Monday" },
    { id: "MyJobMag", name: "My Job Mag" },
    { id: "JobWebKenya", name: "JobWeb Kenya" },
    { id: "Google", name: "Google Jobs" },
  ];

  const refreshJobs = async () => {
    try {
      setIsRefreshing(true);
      setRefreshStatus(`Testing ${selectedSource === "all" ? "all sources" : selectedSource}...`);
      
      toast({
        title: `Testing ${selectedSource === "all" ? "all job sources" : selectedSource}`,
        description: "This may take up to a minute while we fetch and test jobs from the selected source.",
      });

      // Determine which sources to scrape
      const sourcesToScrape = selectedSource === "all" 
        ? sources.filter(s => s.id !== "all").map(s => s.id)
        : [selectedSource];

      console.log("Testing sources:", sourcesToScrape);

      // Call the Edge Function to scrape jobs from selected sources
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: { 
          refreshAll: selectedSource === "all",
          debug: true, // Enable detailed debugging
          testMode: selectedSource !== "all", // Enable test mode when testing a single source
          sources: sourcesToScrape,
          keywords: ["supply chain", "logistics", "procurement", "warehouse", "inventory"]
        },
      });
      
      if (error) {
        console.error('Error testing job sources:', error);
        toast({
          variant: "destructive",
          title: "Error testing job sources",
          description: "There was a problem testing the job sources. Check console for details.",
        });
      } else {
        console.log('Job source test completed:', data);
        
        // Show a more detailed toast with results
        if (data.sourceResults) {
          const successfulSources = Object.entries(data.sourceResults)
            .filter(([_, result]) => (result as any).success)
            .map(([source, _]) => source);
            
          const failedSources = Object.entries(data.sourceResults)
            .filter(([_, result]) => !(result as any).success)
            .map(([source, _]) => source);
          
          const toastDescription = [
            successfulSources.length > 0 ? `✅ Successful: ${successfulSources.join(', ')}` : "",
            failedSources.length > 0 ? `❌ Failed: ${failedSources.join(', ')}` : "",
            `Check console logs for detailed results.`
          ].filter(Boolean).join('\n');
          
          toast({
            title: "Job source test completed",
            description: toastDescription,
            duration: 5000,
          });
        } else {
          // Fallback if detailed results aren't available
          toast({
            title: "Job source test completed",
            description: data.message || "Test completed, check console for details.",
          });
        }
        
        // Refetch the jobs to show the newly scraped ones
        onRefreshComplete();
      }
    } catch (error) {
      console.error('Exception when testing job sources:', error);
      toast({
        variant: "destructive",
        title: "Error testing job sources",
        description: "Something went wrong. Please check the console for detailed error logs.",
      });
    } finally {
      setIsRefreshing(false);
      setRefreshStatus(null);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Select 
        value={selectedSource} 
        onValueChange={setSelectedSource}
        disabled={isRefreshing}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select a source" />
        </SelectTrigger>
        <SelectContent>
          {sources.map((source) => (
            <SelectItem key={source.id} value={source.id}>
              {source.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        onClick={refreshJobs} 
        disabled={isRefreshing}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto"
      >
        {isRefreshing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {refreshStatus || "Testing..."}
          </>
        ) : (
          <>
            <RefreshCcw className="h-4 w-4" />
            Test Source
          </>
        )}
      </Button>
    </div>
  );
};
