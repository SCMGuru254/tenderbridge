
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { newsService, SupplyChainNews } from '@/services/newsService';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export default function SupplyChainInsights() {
  const [news, setNews] = useState<SupplyChainNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await newsService.getNews();
      
      if (newsData.length === 0) {
        // If no news, trigger the fetch function
        const success = await newsService.fetchAndStoreNews();
        if (success) {
          // Try to get news again after fetch
          const freshNews = await newsService.getNews();
          setNews(freshNews);
        } else {
          setError("Unable to fetch the latest news. Please try again later.");
        }
      } else {
        setNews(newsData);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError("Failed to load news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const success = await newsService.fetchAndStoreNews();
      if (success) {
        // Refetch news data
        const freshNews = await newsService.getNews();
        setNews(freshNews);
      }
    } catch (error) {
      console.error('Error refreshing news:', error);
      setError("Failed to refresh news. Please try again later.");
    } finally {
      setRefreshing(false);
    }
  };

  const sources = [...new Set(news.map(item => item.source_name))];
  
  const filteredNews = activeSource 
    ? news.filter(item => item.source_name === activeSource)
    : news;

  return (
    <div className="container mx-auto px-4 py-12 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Supply Chain Insights</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest supply chain news and trends
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh News"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="mb-4 flex flex-nowrap overflow-x-auto pb-2">
            <TabsTrigger value="all" onClick={() => setActiveSource(null)}>
              All Sources
            </TabsTrigger>
            {sources.map(source => (
              <TabsTrigger 
                key={source} 
                value={source}
                onClick={() => setActiveSource(source)}
              >
                {source}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredNews.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-lg font-medium mb-2">No news articles available</p>
                    <p className="text-muted-foreground mb-6">We couldn't find any supply chain news at the moment.</p>
                    <Button onClick={handleRefresh} disabled={refreshing}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                      Fetch Latest News
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredNews.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl line-clamp-2">
                          <a 
                            href={item.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {item.title}
                          </a>
                        </CardTitle>
                        <CardDescription>
                          {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{item.source_name}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ScrollArea className="h-[150px]">
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </ScrollArea>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags && item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                      {item.tags && item.tags.length > 3 && (
                        <Badge variant="outline">+{item.tags.length - 3} more</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
