import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';
import { parseRSS } from '@/utils/rssParser';
import { newsAnalyzer } from './aiAgents';

export interface SupplyChainNews {
  id: string;
  title: string;
  content: string;
  source_url: string;
  source_name: string;
  published_at: string;
  created_at: string;
  analysis?: {
    summary: string;
    impact: string;
    opportunities: string[];
  };
}

const NEWS_SOURCES = [
  {
    name: 'Supply Chain Digital',
    url: 'https://www.supplychaindigital.com/rss/news.xml',
    type: 'rss'
  },
  {
    name: 'Supply Chain Brain',
    url: 'https://www.supplychainbrain.com/rss/news',
    type: 'rss'
  },
  {
    name: 'TenderZville Blog',
    url: import.meta.env.VITE_TENDERZVILLE_BLOG_URL,
    type: 'blog'
  }
];

export const newsService = {
  async fetchAndStoreNews() {
    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getTime() - 24);
      
      // Check last fetch time
      const { data: lastFetch } = await supabase
        .from('news_fetch_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (lastFetch && new Date(lastFetch.created_at) > twentyFourHoursAgo) {
        console.log('News was fetched within last 24 hours');
        return;
      }

      // Fetch from all sources
      const newsItems = await Promise.all(
        NEWS_SOURCES.map(async (source) => {
          try {
            const response = await axios.get(source.url);
            if (source.type === 'rss') {
              const feed = await parseRSS(response.data);
              return feed.items.map(item => ({
                title: item.title,
                content: item.content,
                source_url: item.link,
                source_name: source.name,
                published_at: new Date(item.pubDate).toISOString(),
                created_at: new Date().toISOString()
              }));
            } else if (source.type === 'blog') {
              const posts = await this.parseTenderzvilleBlog(response.data);
              return posts.map(post => ({
                title: post.title,
                content: post.excerpt,
                source_url: post.url,
                source_name: source.name,
                published_at: new Date(post.date).toISOString(),
                created_at: new Date().toISOString()
              }));
            }
            return [];
          } catch (error) {
            console.error(`Error fetching from ${source.name}:`, error);
            return [];
          }
        })
      );

      // Flatten and analyze news items
      const flattenedNews = newsItems.flat();
      if (flattenedNews.length > 0) {
        // Get AI analysis for news items
        const analyzedNews = await Promise.all(
          flattenedNews.map(async (news) => {
            const analysis = await newsAnalyzer.processNews([news]);
            return {
              ...news,
              analysis: analysis || null
            };
          })
        );

        await supabase.from('supply_chain_news').insert(analyzedNews);
      }

      // Log the fetch
      await supabase.from('news_fetch_log').insert({
        created_at: new Date().toISOString()
      });

      // Delete old news (older than 14 days)
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      
      await supabase
        .from('supply_chain_news')
        .delete()
        .lt('created_at', fourteenDaysAgo.toISOString());

    } catch (error) {
      console.error('Error in fetchAndStoreNews:', error);
      throw error;
    }
  },

  async getNews() {
    // Ensure news is up to date
    await this.fetchAndStoreNews();
    
    // Return current news
    const { data: news, error } = await supabase
      .from('supply_chain_news')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return news;
  },

  async parseTenderzvilleBlog(html: string): Promise<Array<{ title: string; excerpt: string; url: string; date: string }>> {
    try {
      // Create a temporary DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract blog posts
      const posts = Array.from(doc.querySelectorAll('.blog-post')).map(post => {
        const title = post.querySelector('h2')?.textContent?.trim() || '';
        const excerpt = post.querySelector('.excerpt')?.textContent?.trim() || '';
        const url = post.querySelector('a')?.href || '';
        const date = post.querySelector('.date')?.textContent?.trim() || new Date().toISOString();

        return {
          title,
          excerpt,
          url,
          date
        };
      });

      return posts;
    } catch (error) {
      console.error('Error parsing Tenderzville blog:', error);
      return [];
    }
  }
}; 