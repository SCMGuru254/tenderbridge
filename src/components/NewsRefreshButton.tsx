
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Newspaper } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewsRefreshButtonProps {
  onRefreshComplete: () => void;
}

export const NewsRefreshButton = ({ onRefreshComplete }: NewsRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshNews = async () => {
    try {
      setIsRefreshing(true);
      toast({
        title: "Refreshing news...",
        description: "This may take up to a minute while we fetch the latest supply chain news.",
      });

      // Call the Edge Function to scrape news
      const { data, error } = await supabase.functions.invoke('scrape-news');
      
      if (error) {
        console.error('Error refreshing news:', error);
        toast({
          variant: "destructive",
          title: "Error refreshing news",
          description: "There was a problem fetching the latest news. Please try again later.",
        });
      } else {
        console.log('News refreshed successfully:', data);
        // Refetch the news to show the newly scraped ones
        onRefreshComplete();
        toast({
          title: "News refreshed!",
          description: `${data.message}. Showing the latest supply chain news and updates.`,
        });
      }
    } catch (error) {
      console.error('Exception when refreshing news:', error);
      toast({
        variant: "destructive",
        title: "Error refreshing news",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      onClick={refreshNews} 
      disabled={isRefreshing}
      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
    >
      {isRefreshing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching News...
        </>
      ) : (
        <>
          <Newspaper className="h-4 w-4" />
          Refresh News
        </>
      )}
    </Button>
  );
};
