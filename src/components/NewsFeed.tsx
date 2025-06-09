
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { newsService, SupplyChainNews } from "@/services/newsService";
import { NewsRefreshButton } from "./NewsRefreshButton";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  published_at: string;
  source_name: string;
  source_url: string;
  tags: string[];
}

export const NewsFeed = () => {
  const [news, setNews] = useState<SupplyChainNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await newsService.getNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert SupplyChainNews to NewsItem format for analysis
  const convertToNewsItem = (item: SupplyChainNews): NewsItem => ({
    ...item,
    published_at: item.published_at || new Date().toISOString()
  });

  const analyzeNews = async (item: SupplyChainNews) => {
    const newsItem = convertToNewsItem(item);
    const analysis = await newsService.analyzeNews({
      title: newsItem.title,
      content: newsItem.content
    });
    
    if (analysis) {
      console.log('News analysis:', analysis);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Supply Chain News</h2>
          <NewsRefreshButton onRefreshComplete={loadNews} />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supply Chain News</h2>
        <NewsRefreshButton onRefreshComplete={loadNews} />
      </div>

      {news.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No news articles available. Try refreshing to fetch the latest supply chain news.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {news.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => analyzeNews(item)}
                    className="shrink-0"
                  >
                    Analyze
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{item.source_name}</Badge>
                  {item.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {item.content}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Recent'}
                  </span>
                  {item.source_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={item.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Read More
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
