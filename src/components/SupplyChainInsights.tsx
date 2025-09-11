import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  url: string;
  published_at: string;
  source: string;
  category: string;
  created_at: string;
}

const SupplyChainInsights = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setNewsItems(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const { error } = await supabase.functions.invoke('scrape-news');
      if (error) throw error;
      
      // Wait a moment for the data to be processed
      setTimeout(() => {
        fetchNews(true);
      }, 2000);
      
      toast.success('News refreshed successfully');
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast.error('Failed to refresh news');
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      // Fallback for invalid dates
      return 'Recently';
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading && newsItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading supply chain insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Supply Chain Insights
            </h1>
            <p className="text-muted-foreground">
              Stay updated with the latest supply chain news and trends
            </p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh News
          </Button>
        </div>

        {/* News Sources */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            All Sources
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-secondary">
            <ExternalLink className="h-3 w-3 mr-1" />
            supplychain247.com
          </Badge>
        </div>

        {/* News Items */}
        <div className="space-y-4">
          {newsItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No news items found</h3>
                <p className="text-muted-foreground mb-4">
                  Try refreshing to get the latest supply chain insights.
                </p>
                <Button onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh News
                </Button>
              </CardContent>
            </Card>
          ) : (
            newsItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.published_at)}
                        </div>
                        {item.source && (
                          <Badge variant="secondary" className="text-xs">
                            {item.source}
                          </Badge>
                        )}
                        {item.category && (
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {item.content && (
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      {item.content.length > 200 
                        ? `${item.content.slice(0, 200)}...` 
                        : item.content}
                    </CardDescription>
                    
                    {item.url && (
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Read Full Article
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {newsItems.length >= 20 && (
          <div className="text-center">
            <Button variant="outline" onClick={() => fetchNews()}>
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyChainInsights;