
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// News source URLs
const NEWS_SOURCES = [
  {
    name: "Supply Chain Digital",
    url: "https://www.supplychaindigital.com/rss/region/africa"
  },
  {
    name: "Logistics Update Africa",
    url: "https://www.logupdateafrica.com/rss/category/supply-chain"
  },
  {
    name: "African Business",
    url: "https://african.business/category/sectors/logistics/feed/"
  }
];

// Parse RSS feed
async function parseRSS(url: string, sourceName: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    const items = Array.from(xmlDoc.querySelectorAll("item"));
    
    return items.map(item => {
      const title = item.querySelector("title")?.textContent || "No title";
      const link = item.querySelector("link")?.textContent || "";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent || new Date()).toISOString();
      
      // Get content from different possible tags
      const contentEncoded = item.querySelector("content\\:encoded")?.textContent;
      const description = item.querySelector("description")?.textContent;
      const content = contentEncoded || description || "";
      
      // Extract categories/tags
      const categories = Array.from(item.querySelectorAll("category"))
        .map(cat => cat.textContent)
        .filter(Boolean) as string[];
      
      return {
        title,
        content,
        source_url: link,
        published_at: pubDate,
        source_name: sourceName,
        tags: categories.length > 0 ? categories : ["Supply Chain", "Logistics", "Kenya"]
      };
    });
  } catch (error) {
    console.error(`Error parsing RSS from ${url}:`, error);
    return [];
  }
}

// No fallback news - only real data sources

serve(async (req) => {
  try {
    // Add CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
    
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }
    
    // Collect news from all sources
    let allNewsItems: any[] = [];
    
    // Try to fetch from RSS feeds
    for (const source of NEWS_SOURCES) {
      const newsItems = await parseRSS(source.url, source.name);
      allNewsItems = [...allNewsItems, ...newsItems];
    }
    
    // Only proceed if we have real news from RSS feeds
    if (allNewsItems.length === 0) {
      console.log("No real news data available from RSS feeds");
      return new Response(
        JSON.stringify({
          success: true,
          count: 0,
          message: "No real news data available from RSS feeds at this time"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }
    
    // Insert news items into the database
    if (allNewsItems.length > 0) {
      const { error } = await supabase
        .from('supply_chain_news')
        .upsert(
          allNewsItems.map(item => ({
            ...item,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'source_url' }
        );
      
      if (error) {
        console.error("Error inserting news:", error);
        throw error;
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        count: allNewsItems.length,
        message: `Successfully processed ${allNewsItems.length} news items`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in scrape-news function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
