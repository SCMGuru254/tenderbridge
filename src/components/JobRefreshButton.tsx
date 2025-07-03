
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobRefreshButtonProps {
  onClick: () => void;
}

export const JobRefreshButton = ({ onClick }: JobRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const { toast } = useToast();

  const sources = [
    { id: "all", name: "All Sources" },
    { id: "LinkedIn", name: "LinkedIn" },
    { id: "BrighterMonday", name: "Brighter Monday" },
    { id: "MyJobMag", name: "My Job Mag" },
    { id: "Fuzu", name: "Fuzu" },
    { id: "JobsInKenya", name: "Jobs In Kenya" },
  ];

  const getLoadingMessage = () => {
    const messages = [
      "Hunting for jobs...",
      "Please give me a minute...",
      "Loading fresh opportunities...",
      "Gathering job listings...",
      "Almost there...",
      "Finding your next role..."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const refreshJobs = async () => {
    try {
      setIsRefreshing(true);
      const loadingMsg = getLoadingMessage();
      setRefreshStatus(loadingMsg);
      
      toast({
        title: "Fetching Job Opportunities",
        description: "We're gathering the latest supply chain jobs for you. This might take a moment...",
      });

      const sourcesToScrape = selectedSource === "all" 
        ? sources.filter(s => s.id !== "all").map(s => s.id)
        : [selectedSource];

      console.log("Scraping sources:", sourcesToScrape);

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
            title: "Job refresh completed!",
            description: toastDescription,
            duration: 5000,
          });
        } else {
          toast({
            title: "Jobs refreshed successfully!",
            description: data?.message || "New job opportunities have been added to your feed.",
          });
        }
        
        onClick();
      }
    } catch (error) {
      console.error('Exception when scraping jobs:', error);
      toast({
        variant: "destructive",
        title: "Error refreshing jobs",
        description: "Something went wrong. Please check your connection and try again.",
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
            {refreshStatus || "Loading..."}
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
