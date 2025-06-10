import { supabase } from '@/integrations/supabase/client';
import Parser from 'rss-parser';

const rssParser = new Parser();

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
  private apiKey = process.env.NEWS_API_KEY || '';

  async getNews(): Promise<SupplyChainNews[]> {
    try {
      const { data, error } = await supabase
        .from('supply_chain_news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async fetchAndStoreNews(): Promise<{ success: boolean; count: number; message?: string }> {
    try {
      if (!this.apiKey) {
        return { success: false, count: 0, message: 'News API key not configured' };
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

      return { 
        success: true, 
        count: data?.length || 0,
        message: `Successfully stored ${data?.length || 0} news articles`
      };

    } catch (error) {
      console.error('Error fetching and storing news:', error);
      return { 
        success: false, 
        count: 0, 
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async fetchRSSFeed(url: string): Promise<SupplyChainNews[]> {
    try {
      const feed = await rssParser.parseURL(url);
      
      if (!feed.items || !Array.isArray(feed.items)) {
        return [];
      }

      return feed.items.slice(0, 10).map((item: any, index: number) => ({
        id: `rss-${Date.now()}-${index}`,
        title: item.title || 'Untitled',
        content: item.contentSnippet || item.content || '',
        source_name: feed.title || 'RSS Feed',
        source_url: item.link || '',
        published_date: item.pubDate || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: this.extractTags((item.title || '') + ' ' + (item.contentSnippet || ''))
      }));
    } catch (error) {
      console.error('Error parsing RSS feed:', error);
      return [];
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
      // Simple analysis - in production, you'd use AI services
      const sentiment = this.analyzeSentiment(newsItem.title + ' ' + newsItem.content);
      const categories = this.categorizeNews(newsItem.title + ' ' + newsItem.content);
      
      return {
        sentiment,
        categories,
        summary: newsItem.content.slice(0, 200) + '...'
      };
    } catch (error) {
      console.error('Error analyzing news:', error);
      return null;
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
