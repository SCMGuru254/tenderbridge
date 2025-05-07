
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import NewsCard from './NewsCard';
import { newsService } from '../services/newsService';
import { AIAgent, AGENT_ROLES } from '../services/aiAgents';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  published_date: string;
  source_name: string;
  source_url: string;
  tags: string[];
  analysis?: string;
}

const NewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const newsAnalyzer = new AIAgent(AGENT_ROLES.NEWS_ANALYZER);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const newsItems = await newsService.getNews();
      
      // Analyze each news item using the AI agent
      const analyzedNews = await Promise.all(
        newsItems.map(async (item: NewsItem) => {
          try {
            const analysis = await newsAnalyzer.processNews({
              title: item.title,
              content: item.content
            });
            return { ...item, analysis };
          } catch (error) {
            console.error('Error analyzing news:', error);
            return item;
          }
        })
      );

      setNews(analyzedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news updates');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await newsService.fetchAndStoreNews();
      await fetchNews();
      toast.success('News feed updated successfully');
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast.error('Failed to refresh news feed');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Supply Chain News</h1>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={refreshing ? "animate-spin" : ""} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {news.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-muted-foreground">No news items available. Try refreshing the feed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              content={item.content}
              publishedDate={item.published_date}
              sourceName={item.source_name}
              sourceUrl={item.source_url}
              tags={item.tags}
              analysis={item.analysis}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
