
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Newspaper, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNewsAPI } from "@/hooks/useNewsAPI";

interface NewsRefreshButtonProps {
  onRefreshComplete: () => void;
}

export const NewsRefreshButton = ({ onRefreshComplete }: NewsRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { fetchSupplyChainNews } = useNewsAPI();

  const refreshNews = async () => {
    try {
      setIsRefreshing(true);
      toast({
        title: "Fetching latest news...",
        description: "Getting the most recent supply chain news from News API.",
      });

      const result = await fetchSupplyChainNews();
      
      if (result?.success) {
        onRefreshComplete();
        toast({
          title: "News updated!",
          description: `Successfully fetched ${result.count} new supply chain articles.`,
        });
      } else {
        throw new Error("Failed to fetch news");
      }
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast({
        variant: "destructive",
        title: "Error refreshing news",
        description: "There was a problem fetching the latest news. Please try again later.",
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
          <Zap className="h-4 w-4" />
          Refresh with News API
        </>
      )}
    </Button>
  );
};
