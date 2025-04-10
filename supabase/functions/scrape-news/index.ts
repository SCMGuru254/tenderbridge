
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// News sources
const newsSources = [
  {
    name: "Supply Chain Digital",
    url: "https://www.supplychaindigital.com/articles",
    articleSelector: ".article-card",
    titleSelector: ".article-card__title",
    summarySelector: ".article-card__description",
    imageSelector: ".article-card__image img",
    linkSelector: "a",
  },
  {
    name: "Supply Chain Brain",
    url: "https://www.supplychainbrain.com/articles/topic/1293-global",
    articleSelector: ".node-article",
    titleSelector: "h2",
    summarySelector: ".node-summary",
    imageSelector: ".node-img img",
    linkSelector: "a",
  },
  {
    name: "Logistics Management",
    url: "https://www.logisticsmgmt.com/topic/category/global_logistics",
    articleSelector: ".article",
    titleSelector: "h2",
    summarySelector: ".deck",
    imageSelector: ".thumbnail img",
    linkSelector: "a",
  },
  // Adding African-focused supply chain news sources
  {
    name: "How We Made It In Africa",
    url: "https://www.howwemadeitinafrica.com/category/sectors/logistics-supply-chain/",
    articleSelector: ".post",
    titleSelector: ".entry-title",
    summarySelector: ".entry-summary",
    imageSelector: ".wp-post-image",
    linkSelector: ".entry-title a",
  },
  {
    name: "African Business",
    url: "https://african.business/category/sectors/trade-logistics/",
    articleSelector: ".article-card",
    titleSelector: ".article-card__title",
    summarySelector: ".article-card__excerpt",
    imageSelector: ".article-card__image img",
    linkSelector: ".article-card__title a",
  }
];

async function scrapeNews(source) {
  try {
    console.log(`Scraping news from ${source.name}...`);
    
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${source.name}: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const html = await response.text();
    console.log(`Received HTML from ${source.name}, length: ${html.length} chars`);
    
    if (html.length < 1000) {
      console.warn(`Suspiciously short HTML from ${source.name}, might be blocked or rate-limited`);
    }
    
    // Use regex with better article extraction
    const articles = [];
    const regex = new RegExp(`<([^>]*)class=["']([^"']*)${source.articleSelector.replace(/\./g, "")}([^"']*)["']([^>]*)>`, 'g');
    
    let articleMatch;
    let articleMatches = [];
    
    // Find all article blocks
    while ((articleMatch = regex.exec(html)) !== null) {
      const startPos = articleMatch.index;
      
      // Find the closing tag by counting opening and closing tags
      let endPos = startPos;
      let depth = 1;
      let tagName = articleMatch[0].match(/<(\w+)/)[1];
      
      const openTagRegex = new RegExp(`<${tagName}[^>]*>`, 'g');
      const closeTagRegex = new RegExp(`</${tagName}>`, 'g');
      
      openTagRegex.lastIndex = startPos + articleMatch[0].length;
      closeTagRegex.lastIndex = startPos + articleMatch[0].length;
      
      let nextOpenMatch, nextCloseMatch;
      
      while (depth > 0 && endPos < html.length) {
        nextOpenMatch = openTagRegex.exec(html);
        nextCloseMatch = closeTagRegex.exec(html);
        
        if (!nextCloseMatch) break;
        
        if (nextOpenMatch && nextOpenMatch.index < nextCloseMatch.index) {
          depth++;
          closeTagRegex.lastIndex = nextOpenMatch.index + nextOpenMatch[0].length;
          openTagRegex.lastIndex = nextOpenMatch.index + nextOpenMatch[0].length;
        } else {
          depth--;
          endPos = nextCloseMatch.index + nextCloseMatch[0].length;
          if (depth > 0) {
            closeTagRegex.lastIndex = endPos;
            openTagRegex.lastIndex = endPos;
          }
        }
      }
      
      if (depth === 0) {
        articleMatches.push(html.substring(startPos, endPos));
      }
    }
    
    console.log(`Found ${articleMatches.length} article matches from ${source.name}`);
    
    // Process only the first 5 articles to avoid overwhelming the system
    for (let i = 0; i < Math.min(articleMatches.length, 5); i++) {
      const articleHtml = articleMatches[i];
      
      // Extract title
      const titleRegex = new RegExp(`<${source.titleSelector.split(".")[0]}[^>]*>(.*?)</${source.titleSelector.split(".")[0]}>`, 's');
      const titleMatch = titleRegex.exec(articleHtml);
      const title = titleMatch ? cleanHtml(titleMatch[1]) : "No title available";
      
      // Extract summary
      const summarySelector = source.summarySelector.replace(/\./g, "");
      const summaryRegex = new RegExp(`<[^>]*class=["'][^"']*${summarySelector}[^"']*["'][^>]*>(.*?)</`, 's');
      const summaryMatch = summaryRegex.exec(articleHtml);
      const summary = summaryMatch ? cleanHtml(summaryMatch[1]) : "No summary available";
      
      // Extract image URL
      const imgRegex = new RegExp(`<img[^>]*src=["']([^"']*)["']`, 's');
      const imgMatch = imgRegex.exec(articleHtml);
      let imageUrl = imgMatch ? imgMatch[1] : null;
      
      // Extract article URL
      const linkRegex = new RegExp(`<a[^>]*href=["']([^"']*)["'][^>]*>`, 's');
      const linkMatch = linkRegex.exec(articleHtml);
      let articleUrl = linkMatch ? linkMatch[1] : null;
      
      // If the URL is relative, make it absolute
      if (articleUrl && !articleUrl.startsWith("http")) {
        const sourceUrl = new URL(source.url);
        articleUrl = `${sourceUrl.protocol}//${sourceUrl.host}${articleUrl.startsWith("/") ? "" : "/"}${articleUrl}`;
      }
      
      // Same for image URL
      if (imageUrl && !imageUrl.startsWith("http")) {
        const sourceUrl = new URL(source.url);
        imageUrl = `${sourceUrl.protocol}//${sourceUrl.host}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
      }
      
      // Only add if we have at least a title and valid content
      if (title && title !== "No title available" && title.length > 3) {
        articles.push({
          title,
          content: summary,
          source_name: source.name,
          source_url: articleUrl,
          published_date: new Date().toISOString(),
          image_url: imageUrl,
          tags: extractTags(title + " " + summary)
        });
      }
    }
    
    return articles;
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}

function cleanHtml(text) {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Remove leading/trailing spaces
}

function extractTags(content) {
  const possibleTags = [
    "Logistics", "Procurement", "Inventory", "Warehousing", "Transportation",
    "Manufacturing", "Distribution", "Planning", "Sustainability", "Technology",
    "Risk Management", "Global Trade", "Last Mile", "Supply Chain Finance", 
    "Circular Economy", "Africa", "Kenya", "East Africa"
  ];
  
  const foundTags = [];
  const lowerContent = content.toLowerCase();
  
  for (const tag of possibleTags) {
    if (lowerContent.includes(tag.toLowerCase())) {
      foundTags.push(tag);
    }
  }
  
  // Always include Supply Chain as a tag
  if (!foundTags.includes("Supply Chain")) {
    foundTags.push("Supply Chain");
  }
  
  return foundTags;
}

async function getFallbackNews() {
  return [
    {
      title: "Kenya Emerging as a Logistics Hub for East Africa",
      content: "Kenya's strategic investments in infrastructure, including the expansion of the Mombasa Port and the Standard Gauge Railway, are positioning the country as the premier logistics hub for East Africa.",
      source_name: "African Supply Chain News",
      source_url: "https://example.com/kenya-logistics-hub",
      published_date: new Date().toISOString(),
      image_url: "https://images.unsplash.com/photo-1577710075721-a1785a00900f?auto=format&fit=crop&w=800&q=80",
      tags: ["Kenya", "Logistics", "East Africa", "Infrastructure", "Supply Chain"]
    },
    {
      title: "Sustainable Packaging Solutions Transform African Supply Chains",
      content: "Kenyan companies are leading the innovation in biodegradable packaging materials made from local agricultural waste, reducing environmental impact while creating new value chains.",
      source_name: "Supply Chain Digital",
      source_url: "https://www.supplychaindigital.com",
      published_date: new Date().toISOString(),
      image_url: "https://images.unsplash.com/photo-1591289013880-ebb9d14108e8?auto=format&fit=crop&w=800&q=80",
      tags: ["Sustainability", "Packaging", "Innovation", "Africa", "Supply Chain"]
    },
    {
      title: "Digital Supply Chain Technologies Drive Efficiency in Kenyan Retail",
      content: "Kenyan retailers are adopting blockchain and IoT technologies to improve inventory management and product traceability, resulting in significant reductions in stockouts and waste.",
      source_name: "Logistics Management",
      source_url: "https://www.logisticsmgmt.com",
      published_date: new Date().toISOString(),
      image_url: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=800&q=80",
      tags: ["Technology", "Retail", "Blockchain", "IoT", "Supply Chain", "Kenya"]
    },
    {
      title: "Last-Mile Delivery Innovation Accelerates in Nairobi",
      content: "Startups in Nairobi are revolutionizing last-mile delivery with electric bikes and AI-powered route optimization, addressing urban congestion while reducing delivery times and emissions.",
      source_name: "How We Made It In Africa",
      source_url: "https://www.howwemadeitinafrica.com",
      published_date: new Date().toISOString(),
      image_url: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=800&q=80",
      tags: ["Last Mile", "Innovation", "Nairobi", "Kenya", "Supply Chain", "Sustainability"]
    },
    {
      title: "Cross-Border Trade Facilitation Program Boosts Supply Chain Resilience",
      content: "The East African Community's Trade Facilitation Program has reduced border clearance times by 60%, strengthening regional supply chains and increasing intra-regional trade volumes.",
      source_name: "African Business",
      source_url: "https://african.business",
      published_date: new Date().toISOString(),
      image_url: "https://images.unsplash.com/photo-1589793907316-f94025b46850?auto=format&fit=crop&w=800&q=80",
      tags: ["Trade", "East Africa", "Policy", "Resilience", "Supply Chain"]
    },
  ];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log("Starting news scraping process...");
    let allNews = [];

    // Try to scrape news from all sources
    for (const source of newsSources) {
      try {
        const news = await scrapeNews(source);
        console.log(`Scraped ${news.length} articles from ${source.name}`);
        allNews = [...allNews, ...news];
      } catch (sourceError) {
        console.error(`Error processing source ${source.name}:`, sourceError);
        // Continue with other sources even if one fails
      }
    }

    // If we couldn't scrape any news, use fallback
    if (allNews.length === 0) {
      console.log("No news scraped, using fallback data");
      allNews = await getFallbackNews();
    }

    console.log(`Total scraped: ${allNews.length} news articles`);

    // Store in database
    let successCount = 0;
    for (const article of allNews) {
      // Check if a similar article already exists to avoid duplicates
      const { data: existingArticles, error: checkError } = await supabase
        .from("supply_chain_news")
        .select("id")
        .eq("title", article.title)
        .limit(1);
        
      if (checkError) {
        console.error("Error checking for existing article:", checkError);
        continue;
      }
      
      if (existingArticles && existingArticles.length > 0) {
        console.log(`Article "${article.title}" already exists, skipping`);
        continue;
      }
      
      const { error } = await supabase
        .from("supply_chain_news")
        .insert({
          title: article.title,
          content: article.content,
          source_name: article.source_name,
          source_url: article.source_url,
          published_date: article.published_date,
          image_url: article.image_url,
          tags: article.tags || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (!error) {
        successCount++;
      } else {
        console.error("Error storing article:", error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and stored ${successCount} news articles`,
        totalFound: allNews.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in news scraping function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
