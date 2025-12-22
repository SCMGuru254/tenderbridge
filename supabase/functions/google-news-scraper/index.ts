import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewsArticle {
  title: string;
  link: string;
  source: string;
  published_date: string;
  content: string;
}

// Google News RSS feed URLs for supply chain topics
const GOOGLE_NEWS_FEEDS = [
  { url: 'https://news.google.com/rss/search?q=supply+chain+logistics&hl=en-US&gl=US&ceid=US:en', source: 'Google News - Supply Chain' },
  { url: 'https://news.google.com/rss/search?q=procurement+sourcing&hl=en-US&gl=US&ceid=US:en', source: 'Google News - Procurement' },
  { url: 'https://news.google.com/rss/search?q=warehouse+management+logistics&hl=en-US&gl=US&ceid=US:en', source: 'Google News - Warehouse' },
  { url: 'https://news.google.com/rss/search?q=freight+shipping+transportation&hl=en-US&gl=US&ceid=US:en', source: 'Google News - Freight' },
  { url: 'https://news.google.com/rss/search?q=supply+chain+africa+kenya&hl=en-US&gl=US&ceid=US:en', source: 'Google News - Africa' },
];

const FORBES_FEEDS = [
  { url: 'https://www.forbes.com/innovation/feed/', source: 'Forbes Innovation' },
  { url: 'https://www.forbes.com/business/feed/', source: 'Forbes Business' },
];

async function fetchRSSFeed(feedUrl: string, sourceName: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${sourceName}: ${response.status}`);
      return [];
    }
    
    const xml = await response.text();
    const articles: NewsArticle[] = [];
    
    // Parse RSS items
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/gi);
    
    for (const match of itemMatches) {
      const item = match[1];
      
      const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      
      if (titleMatch && linkMatch) {
        // Filter for supply chain relevance
        const title = titleMatch[1].trim().replace(/<!\[CDATA\[|\]\]>/g, '');
        const description = descMatch ? descMatch[1].trim().replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, '') : '';
        
        const keywords = ['supply chain', 'logistics', 'warehouse', 'freight', 'procurement', 
                         'shipping', 'inventory', 'distribution', 'sourcing', 'manufacturing',
                         'import', 'export', 'cargo', 'transport', 'fulfillment', 'port',
                         'container', 'operations', 'demand planning', 'supplier'];
        
        const isRelevant = keywords.some(keyword => 
          title.toLowerCase().includes(keyword) || description.toLowerCase().includes(keyword)
        );
        
        if (isRelevant || sourceName.includes('Supply Chain')) {
          articles.push({
            title: title,
            link: linkMatch[1].trim().replace(/<!\[CDATA\[|\]\]>/g, ''),
            source: sourceName,
            published_date: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
            content: description.slice(0, 500) || 'Read the full article for more details.'
          });
        }
      }
    }
    
    return articles.slice(0, 10); // Limit per source
  } catch (error) {
    console.error(`Error fetching ${sourceName}:`, error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting Google News & Forbes scraping...');
    
    const allArticles: NewsArticle[] = [];
    
    // Fetch from all feeds in parallel
    const allFeeds = [...GOOGLE_NEWS_FEEDS, ...FORBES_FEEDS];
    const feedPromises = allFeeds.map(feed => fetchRSSFeed(feed.url, feed.source));
    const results = await Promise.all(feedPromises);
    
    for (const articles of results) {
      allArticles.push(...articles);
    }
    
    console.log(`Fetched ${allArticles.length} total articles`);
    
    if (allArticles.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No articles found', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Delete old news items (older than 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { error: deleteError } = await supabase
      .from('news_items')
      .delete()
      .lt('created_at', yesterday.toISOString());
    
    if (deleteError) {
      console.error('Error deleting old news:', deleteError);
    }
    
    // Prepare news items for insertion
    const newsToInsert = allArticles.map(article => ({
      title: article.title,
      content: article.content,
      source: article.source,
      source_url: article.link,
      published_at: article.published_date,
      tags: ['supply chain', 'logistics', 'industry news'],
      guid: article.link // Use link as unique identifier
    }));
    
    // Insert news items (upsert to avoid duplicates)
    const { data, error: insertError } = await supabase
      .from('news_items')
      .upsert(newsToInsert, { 
        onConflict: 'guid',
        ignoreDuplicates: true 
      })
      .select();
    
    if (insertError) {
      console.error('Error inserting news:', insertError);
      throw insertError;
    }
    
    console.log(`Successfully stored ${data?.length || 0} articles`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Fetched and stored ${data?.length || 0} supply chain news articles`,
        count: data?.length || 0,
        sources: allFeeds.map(f => f.source)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error in google-news-scraper:', message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
