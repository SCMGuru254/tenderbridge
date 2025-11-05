
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
  // Using edge functions for real news data - no direct API calls from client
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly NEWS_RETENTION_DAYS = 7; // Keep news for 7 days

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
        .limit(100); // Limit to 100 most recent items

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

  async fetchRealNews(): Promise<{ success: boolean; count: number; message?: string }> {
    try {
      performanceMonitor.startMeasure('fetch-real-news');
      
      // Call the news-api-integration edge function for real news data with RSS feeds
      const { data, error } = await supabase.functions.invoke('news-api-integration', {
        body: { 
          searchTerm: '', 
          limit: 100,
          rssFeeds: [
            'https://www.allthingssupplychain.com/feed/',
            'https://www.supplychainbrain.com/rss/articles',
            'https://www.scmdojo.com/feed/',
            'https://www.supplychaintoday.com/feed/',
            'https://www.supplychainshaman.com/feed/'
          ]
        }
      });

      if (error) throw error;

      cache.delete('news'); // Invalidate cache
      analytics.trackUserAction('news-fetch-success', `count:${data?.count || 0}`);

      return { 
        success: true, 
        count: data?.count || 0,
        message: data?.message || 'Successfully fetched real news data'
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
      performanceMonitor.endMeasure('fetch-real-news');
    }
  }

  async fetchSupplyChainRSS(): Promise<{ success: boolean; count: number; message?: string }> {
    try {
      performanceMonitor.startMeasure('fetch-supply-chain-rss');
      
      // Call the scrape-news edge function for real RSS news data
      const { data, error } = await supabase.functions.invoke('scrape-news');

      if (error) throw error;

      cache.delete('news'); // Invalidate cache
      analytics.trackUserAction('rss-fetch-success', `count:${data?.count || 0}`);

      return { 
        success: true, 
        count: data?.count || 0,
        message: data?.message || 'Successfully fetched RSS news data'
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
      performanceMonitor.endMeasure('fetch-supply-chain-rss');
    }
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

  async cleanupOldNews(): Promise<{ success: boolean; count: number; message?: string }> {
    try {
      performanceMonitor.startMeasure('cleanup-old-news');
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.NEWS_RETENTION_DAYS);

      const { data, error } = await supabase
        .from('supply_chain_news')
        .delete()
        .lt('published_date', cutoffDate.toISOString())
        .select();

      if (error) throw error;

      analytics.trackUserAction('news-cleanup', `deleted:${data?.length || 0}`);

      return { 
        success: true, 
        count: data?.length || 0,
        message: `Successfully deleted ${data?.length || 0} old news items`
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
      performanceMonitor.endMeasure('cleanup-old-news');
    }
  }

  // Schedule automatic cleanup every 24 hours
  scheduleNewsCleanup(): void {
    setInterval(() => {
      this.cleanupOldNews().then(result => {
        if (result.success) {
          console.log(`Scheduled cleanup: ${result.message}`);
        } else {
          console.error(`Cleanup failed: ${result.message}`);
        }
      });
    }, 24 * 60 * 60 * 1000); // Run every 24 hours
  }
}

export const newsService = new NewsService();

// Initialize scheduled cleanup
newsService.scheduleNewsCleanup();
