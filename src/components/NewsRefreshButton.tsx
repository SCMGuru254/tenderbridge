
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";
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
      console.log('Starting news refresh...');
      
      toast({
        title: "Fetching latest news...",
        description: "Getting the most recent supply chain news from The News API.",
      });

      const result = await fetchSupplyChainNews();
      console.log('News refresh result:', result);
      
      if (result?.success) {
        onRefreshComplete();
        toast({
          title: "News updated!",
          description: `Successfully fetched ${result.count} new supply chain articles.`,
        });
      } else {
        throw new Error(result?.message || "Failed to fetch news");
      }
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast({
        variant: "destructive",
        title: "Error refreshing news",
        description: "There was a problem fetching the latest news. Please check your API configuration.",
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
