import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { newsService, SupplyChainNews } from '@/services/newsService';
import { formatDistanceToNow } from 'date-fns';

export default function SupplyChainInsights() {
  const [news, setNews] = useState<SupplyChainNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const newsData = await newsService.getNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const sources = [...new Set(news.map(item => item.source_name))];
  
  const filteredNews = activeSource 
    ? news.filter(item => item.source_name === activeSource)
    : news;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Supply Chain Insights</h1>
      <p className="text-muted-foreground mb-8">
        Stay updated with the latest supply chain news and trends
      </p>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
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

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20" />
                  </CardContent>
                </Card>
              ))
            ) : filteredNews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p>No news articles available at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              filteredNews.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">
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
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </ScrollArea>
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