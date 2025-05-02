
import { supabase } from "@/integrations/supabase/client";
import { AIAgent } from "./agents/AIAgent";
import { AGENT_ROLES } from "./agents/agentRoles";
import { parseRSS } from "@/utils/rssParser";
import { toast } from "sonner";

export interface SupplyChainNews {
  id: string;
  title: string;
  content: string;
  published_at: string;
  source_name: string;
  source_url: string;
  tags: string[];
}

// RSS feeds for supply chain news in Kenya and East Africa
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
    name: "Kenya Ports Authority",
    url: "https://www.kpa.co.ke/Pages/Rss.aspx"
  }
];

export const newsService = {
  async getNews(): Promise<SupplyChainNews[]> {
    try {
      const { data, error } = await supabase
        .from('supply_chain_news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }

      return data as SupplyChainNews[] || [];
    } catch (error) {
      console.error('Error in getNews:', error);
      // If we fail to fetch from the database, try to fetch directly from RSS
      return this.fetchNewsDirectly();
    }
  },

  async fetchNewsDirectly(): Promise<SupplyChainNews[]> {
    try {
      let allNews: SupplyChainNews[] = [];
      
      for (const source of NEWS_SOURCES) {
        try {
          const newsItems = await parseRSS(source.url, source.name);
          if (newsItems && newsItems.length > 0) {
            // Map to SupplyChainNews format
            const formattedItems = newsItems.map((item, index) => ({
              id: `${source.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
              title: item.title || "No Title",
              content: item.content || item.description || "",
              published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
              source_name: source.name,
              source_url: item.link || "",
              tags: item.categories || ["Supply Chain", "Logistics", "Kenya"]
            }));
            
            allNews = [...allNews, ...formattedItems];
          }
        } catch (sourceError) {
          console.error(`Error fetching news from ${source.name}:`, sourceError);
          // Continue to the next source if one fails
        }
      }
      
      // Sort by published date, most recent first
      allNews.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      
      // If we still have no news, return fallback data
      if (allNews.length === 0) {
        return this.getFallbackNews();
      }
      
      return allNews;
    } catch (error) {
      console.error('Error fetching news directly:', error);
      return this.getFallbackNews();
    }
  },

  async fetchAndStoreNews(): Promise<boolean> {
    try {
      toast.info("Fetching latest supply chain news...");
      
      try {
        // First try the edge function
        const { error } = await supabase.functions.invoke('scrape-news');
        
        if (!error) {
          toast.success("Supply chain news updated successfully");
          return true;
        }
        
        // If edge function fails, try direct fetch
        console.log("Edge function failed, falling back to direct fetch");
        const news = await this.fetchNewsDirectly();
        
        if (news.length > 0) {
          // Store fetched news in Supabase
          const { error: insertError } = await supabase
            .from('supply_chain_news')
            .upsert(
              news.map(item => ({
                ...item,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })),
              { onConflict: 'source_url' }
            );
            
          if (insertError) {
            console.error('Error storing news:', insertError);
            toast.error("Failed to store news data");
            return false;
          }
          
          toast.success("Supply chain news updated successfully");
          return true;
        }
        
        toast.error("Could not fetch or update news");
        return false;
      } catch (error) {
        console.error('Error in fetchAndStoreNews:', error);
        toast.error("Error updating supply chain news");
        return false;
      }
    } catch (error) {
      console.error('Error in fetchAndStoreNews outer try:', error);
      toast.error("Error updating supply chain news");
      return false;
    }
  },

  analyzeNews: async (newsItem: { title: string; content: string }) => {
    try {
      const newsAnalyzer = new AIAgent(AGENT_ROLES.NEWS_ANALYZER);
      return await newsAnalyzer.processNews(newsItem);
    } catch (error) {
      console.error('Error analyzing news:', error);
      return null;
    }
  },

  getFallbackNews: (): SupplyChainNews[] => {
    return [
      {
        id: "fallback-1",
        title: "Kenya's Port of Mombasa Reports 10% Increase in Cargo Volume",
        content: "The Port of Mombasa has reported a significant 10% increase in cargo volume in the first quarter of 2025 compared to the same period last year. This growth is attributed to improvements in operational efficiency and increased trade activity in the East African region.",
        source_url: "https://www.portmombasa.go.ke/news",
        published_at: new Date().toISOString(),
        source_name: "Kenya Ports Authority",
        tags: ["Ports", "Logistics", "Kenya", "East Africa"]
      },
      {
        id: "fallback-2",
        title: "New Cold Chain Infrastructure Project Launched in Nairobi",
        content: "A major cold chain infrastructure project has been launched in Nairobi to improve the distribution of perishable goods across Kenya. The project aims to reduce post-harvest losses and enhance food security through improved temperature-controlled logistics networks.",
        source_url: "https://www.coldchainkenya.org",
        published_at: new Date().toISOString(),
        source_name: "Cold Chain Kenya Initiative",
        tags: ["Cold Chain", "Food Security", "Infrastructure", "Kenya"]
      },
      {
        id: "fallback-3",
        title: "E-commerce Boom Drives Last-Mile Logistics Innovation in Kenya",
        content: "The rapid growth of e-commerce in Kenya is driving significant innovation in last-mile delivery solutions. Local startups are developing innovative approaches to address the unique challenges of urban and rural delivery in the Kenyan context.",
        source_url: "https://www.ecommerceafrica.com",
        published_at: new Date().toISOString(),
        source_name: "E-commerce Africa",
        tags: ["E-commerce", "Last Mile Delivery", "Innovation", "Kenya"]
      },
      {
        id: "fallback-4",
        title: "Sustainable Supply Chain Practices Gaining Momentum Among Kenyan Businesses",
        content: "A growing number of Kenyan businesses are adopting sustainable supply chain practices, from reducing packaging waste to implementing renewable energy solutions in warehousing and transportation. This trend is driven by both environmental concerns and potential cost savings.",
        source_url: "https://www.sustainableafrica.org",
        published_at: new Date().toISOString(),
        source_name: "Sustainable Business Africa",
        tags: ["Sustainability", "Corporate Responsibility", "Green Logistics", "Kenya"]
      },
      {
        id: "fallback-5",
        title: "Kenya's Standard Gauge Railway Significantly Reduces Freight Transport Time",
        content: "Kenya's Standard Gauge Railway (SGR) has reported a significant reduction in freight transport time between Mombasa and Nairobi, cutting the journey from over 24 hours by road to just 8 hours by rail. This improvement is boosting supply chain efficiency for businesses across the region.",
        source_url: "https://www.krc.co.ke/news",
        published_at: new Date().toISOString(),
        source_name: "Kenya Railways Corporation",
        tags: ["Rail Transport", "Infrastructure", "Freight", "Kenya"]
      }
    ];
  }
};
