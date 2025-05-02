
import { supabase } from "@/integrations/supabase/client";
import { AIAgent } from "./agents/AIAgent"; // Fixed import path
import { AGENT_ROLES } from "./agents/agentRoles"; // Fixed import path
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

      return data as SupplyChainNews[];
    } catch (error) {
      console.error('Error in getNews:', error);
      return [];
    }
  },

  async fetchAndStoreNews(): Promise<boolean> {
    try {
      toast.info("Fetching latest supply chain news...");
      const { error } = await supabase.functions.invoke('scrape-news');
      
      if (error) {
        console.error('Error fetching news from edge function:', error);
        toast.error("Failed to fetch latest news");
        return false;
      }
      
      toast.success("Supply chain news updated successfully");
      return true;
    } catch (error) {
      console.error('Error in fetchAndStoreNews:', error);
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
  }
};
