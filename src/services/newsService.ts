
import { supabase } from '@/integrations/supabase/client';
import { cache } from '@/utils/cache';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { errorHandler } from '@/utils/errorHandling';

export interface SupplyChainNews {
  id: string;
  title: string;
  content: string;
  source_name: string;
  source_url: string;
  published_date: string;
  created_at?: string;
  updated_at?: string;
  tags: string[];
}

export class NewsService {
  private baseUrl = 'https://newsapi.org/v2';
  private apiKey = import.meta.env.VITE_NEWS_API_KEY || '';
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getNews(): Promise<SupplyChainNews[]> {
    try {
      performanceMonitor.startMeasure('fetch-news');
      
      const cachedNews = cache.get<SupplyChainNews[]>('news');
      if (cachedNews) {
        analytics.trackUserAction('news-cache-hit');
        return cachedNews;
      }

      const { data, error } = await supabase
        .from('supply_chain_news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const news = data || [];
      cache.set('news', news, { ttl: this.CACHE_TTL });
      analytics.trackUserAction('news-fetch-success', `count:${news.length}`);
      
      return news;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
      errorHandler.handleError(errorObj, 'NETWORK');
      analytics.trackError(errorObj);
      return [];
    } finally {
      performanceMonitor.endMeasure('fetch-news');
    }
  }

  async fetchAndStoreNews(): Promise<{ success: boolean; count: number; message?: string }> {
    try {
      performanceMonitor.startMeasure('fetch-store-news');

      if (!this.apiKey) {
        throw new Error('News API key not configured');
      }

      const keywords = ['supply chain', 'logistics', 'procurement', 'inventory management'];
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      const response = await fetch(
        `${this.baseUrl}/everything?q="${randomKeyword}"&language=en&sortBy=publishedAt&pageSize=10&apiKey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const newsData = await response.json();

      if (!newsData.articles || newsData.articles.length === 0) {
        return { success: true, count: 0, message: 'No new articles found' };
      }

      const articles = newsData.articles.map((article: any) => ({
        title: article.title,
        content: article.description || article.content || '',
        source_name: article.source?.name || 'Unknown',
        source_url: article.url,
        published_date: article.publishedAt,
        tags: this.extractTags(article.title + ' ' + (article.description || ''))
      }));

      const { data, error } = await supabase
        .from('supply_chain_news')
        .insert(articles)
        .select();

      if (error) throw error;

      cache.delete('news'); // Invalidate cache
      analytics.trackUserAction('news-store-success', `count:${data?.length || 0}`);

      return { 
        success: true, 
        count: data?.length || 0,
        message: `Successfully stored ${data?.length || 0} news articles`
      };

    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
      errorHandler.handleError(errorObj, 'SERVER');
      analytics.trackError(errorObj);
      return { 
        success: false, 
        count: 0, 
        message: errorObj.message
      };
    } finally {
      performanceMonitor.endMeasure('fetch-store-news');
    }
  }

  async fetchRSSFeed(url: string): Promise<SupplyChainNews[]> {
    try {
      performanceMonitor.startMeasure('fetch-rss');
      
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      const items = xmlDoc.getElementsByTagName("item");
      const news: SupplyChainNews[] = [];

      for (let i = 0; i < Math.min(items.length, 10); i++) {
        const item = items[i];
        if (!item) continue;
        const title = item.getElementsByTagName("title")[0]?.textContent || 'Untitled';
        const content = item.getElementsByTagName("description")[0]?.textContent || '';
        const link = item.getElementsByTagName("link")[0]?.textContent || '';
        const pubDate = item.getElementsByTagName("pubDate")[0]?.textContent || new Date().toISOString();
        
        news.push({
          id: `rss-${Date.now()}-${i}`,
          title,
          content,
          source_name: xmlDoc.getElementsByTagName("title")[0]?.textContent || 'RSS Feed',
          source_url: link,
          published_date: pubDate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tags: this.extractTags(title + ' ' + content)
        });
      }

      analytics.trackUserAction('rss-fetch-success', `count:${news.length}`);
      return news;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
      errorHandler.handleError(errorObj, 'NETWORK');
      analytics.trackError(errorObj);
      return [];
    } finally {
      performanceMonitor.endMeasure('fetch-rss');
    }
  }

  private extractTags(text: string): string[] {
    const keywords = [
      'supply chain', 'logistics', 'procurement', 'inventory', 'warehousing',
      'transportation', 'manufacturing', 'distribution', 'sustainability',
      'technology', 'automation', 'AI', 'blockchain', 'IoT', 'Kenya', 'Africa'
    ];

    const lowerText = text.toLowerCase();
    return keywords.filter(keyword => lowerText.includes(keyword));
  }

  async analyzeNews(newsItem: { title: string; content: string }): Promise<any> {
    try {
      performanceMonitor.startMeasure('analyze-news');
      
      const sentiment = this.analyzeSentiment(newsItem.title + ' ' + newsItem.content);
      const categories = this.categorizeNews(newsItem.title + ' ' + newsItem.content);
      
      analytics.trackUserAction('news-analysis', `sentiment:${sentiment}`);
      
      return {
        sentiment,
        categories,
        summary: newsItem.content.slice(0, 200) + '...'
      };
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
      errorHandler.handleError(errorObj, 'SERVER');
      analytics.trackError(errorObj);
      return null;
    } finally {
      performanceMonitor.endMeasure('analyze-news');
    }
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['growth', 'improvement', 'success', 'innovation', 'opportunity'];
    const negativeWords = ['crisis', 'disruption', 'shortage', 'delay', 'problem'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private categorizeNews(text: string): string[] {
    const categories = [
      { name: 'Technology', keywords: ['AI', 'automation', 'digital', 'technology', 'software'] },
      { name: 'Sustainability', keywords: ['green', 'sustainable', 'environment', 'carbon'] },
      { name: 'Trade', keywords: ['trade', 'import', 'export', 'customs', 'border'] },
      { name: 'Manufacturing', keywords: ['manufacturing', 'production', 'factory', 'industry'] }
    ];

    const lowerText = text.toLowerCase();
    return categories
      .filter(category => category.keywords.some(keyword => lowerText.includes(keyword)))
      .map(category => category.name);
  }
}

export const newsService = new NewsService();
