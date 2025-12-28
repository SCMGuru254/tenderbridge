
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { newsService, SupplyChainNews } from '@/services/newsService';
import { formatDistanceToNow } from 'date-fns';
import { RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Sanitize HTML content to prevent XSS attacks
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'b', 'i', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
  });
};

export default function SupplyChainInsights() {
  const [news, setNews] = useState<SupplyChainNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<string | null>(null);

  const [selectedArticle, setSelectedArticle] = useState<SupplyChainNews | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for immediate display
      const mockNews: SupplyChainNews[] = [
        {
          id: '1',
          title: 'Global Supply Chain Trends 2026',
          content: 'Exploring the major shifts in global logistics and supply chain management for the coming year.',
          source_url: '#',
          published_date: new Date().toISOString(),
          source_name: 'SupplyChain KE',
          tags: ['Global', 'Logistics']
        },
        {
          id: '2',
          title: 'Impact of AI on Procurement in Kenya',
          content: 'How artificial intelligence is transforming procurement processes in East Africa.',
          source_url: '#',
          published_date: new Date().toISOString(),
          source_name: 'Industry Report',
          tags: ['AI', 'Procurement']
        },
        {
          id: '3',
          title: 'Sustainable Logistics: A Green Future',
          content: 'Companies are increasingly adopting eco-friendly logistics solutions to reduce carbon footprints.',
          source_url: '#',
          published_date: new Date().toISOString(),
          source_name: 'Sustainability News',
          tags: ['Green', 'Logistics']
        }
      ];

      try {
        const newsData = await newsService.getNews();
        if (newsData && newsData.length > 0) {
          setNews(newsData);
        } else {
          setNews(mockNews);
        }
      } catch (err) {
        setNews(mockNews);
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
      const result = await newsService.fetchRealNews();
      if (result.success) {
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
    <div className="container mx-auto px-4 py-4 mt-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
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
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer" onClick={() => setSelectedArticle(item)}>
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
                          {item.published_date ? formatDistanceToNow(new Date(item.published_date), { addSuffix: true }) : 'Recently'}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{item.source_name}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="h-[150px] overflow-hidden relative">
                      <div 
                        className="prose prose-sm max-w-none line-clamp-[6]"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content || '') }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                    </div>
                    
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

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 pr-6">
                    <DialogTitle className="text-2xl leading-tight">{selectedArticle.title}</DialogTitle>
                    <DialogDescription className="text-sm font-medium">
                      {selectedArticle.published_date ? formatDistanceToNow(new Date(selectedArticle.published_date), { addSuffix: true }) : 'Recently'} • {selectedArticle.source_name}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div 
                  className="prose prose-sm md:prose-base max-w-none text-foreground leading-relaxed"
                >
                  <p className="whitespace-pre-wrap">{selectedArticle.content}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-6">
                  {selectedArticle.tags && selectedArticle.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs uppercase tracking-wider">{tag}</Badge>
                  ))}
                </div>
              </div>
              <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                  Close
                </Button>
                {selectedArticle.source_url && selectedArticle.source_url !== '#' && (
                  <Button asChild>
                    <a href={selectedArticle.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Read Original Article
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
