
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

  // Updated to match the actual sources in the jobSites.ts file
  const sources = [
    { id: "all", name: "All Sources" },
    { id: "LinkedIn", name: "LinkedIn" },
    { id: "BrighterMonday", name: "Brighter Monday" },
    { id: "MyJobMag", name: "My Job Mag" },
    { id: "Fuzu", name: "Fuzu" },
    { id: "JobsInKenya", name: "Jobs In Kenya" },
  ];

  const refreshJobs = async () => {
    try {
      setIsRefreshing(true);
      setRefreshStatus(`Scraping ${selectedSource === "all" ? "all sources" : selectedSource}...`);
      
      toast({
        title: `Scraping ${selectedSource === "all" ? "all job sources" : selectedSource}`,
        description: "This may take up to a minute while we fetch jobs from the selected source.",
      });

      // Determine which sources to scrape
      const sourcesToScrape = selectedSource === "all" 
        ? sources.filter(s => s.id !== "all").map(s => s.id)
        : [selectedSource];

      console.log("Scraping sources:", sourcesToScrape);

      // Call the Edge Function to scrape jobs from selected sources
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: { 
          refreshAll: selectedSource === "all",
          debug: true,
          testMode: false,
          forceUpdate: true,
          sources: sourcesToScrape,
          keywords: ["supply chain", "logistics", "procurement", "warehouse", "inventory"],
          cleanTitles: true
        },
      });
      
      if (error) {
        console.error('Error scraping jobs:', error);
        toast({
          variant: "destructive",
          title: "Couldn't refresh jobs",
          description: "We encountered an issue while fetching new job listings. Please try again later.",
        });
      } else {
        console.log('Job scraping completed:', data);
        
        // Show detailed results
        if (data?.sourceResults) {
          const successfulSources = Object.entries(data.sourceResults)
            .filter(([_, result]) => (result as any).success)
            .map(([source, _]) => source);
            
          const failedSources = Object.entries(data.sourceResults)
            .filter(([_, result]) => !(result as any).success)
            .map(([source, _]) => source);
          
          const toastDescription = [
            successfulSources.length > 0 ? `✅ Successful: ${successfulSources.join(', ')}` : "",
            failedSources.length > 0 ? `❌ Failed: ${failedSources.join(', ')}` : "",
            `Total jobs found: ${data.message || 'Check console for details'}`
          ].filter(Boolean).join('\n');
          
          toast({
            title: "Job scraping completed",
            description: toastDescription,
            duration: 5000,
          });
        } else {
          toast({
            title: "Job scraping completed",
            description: data?.message || "Jobs scraped successfully, check console for details.",
          });
        }
        
        // Refetch the jobs to show the newly scraped ones
        onRefreshComplete();
      }
    } catch (error) {
      console.error('Exception when scraping jobs:', error);
      toast({
        variant: "destructive",
        title: "Error scraping jobs",
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
            {refreshStatus || "Scraping..."}
          </>
        ) : (
          <>
            <RefreshCcw className="h-4 w-4" />
            Refresh Jobs
          </>
        )}
      </Button>
    </div>
  );
};
