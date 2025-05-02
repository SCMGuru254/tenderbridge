
import { supabase } from "@/integrations/supabase/client";
import { AIAgent } from "./agents/AIAgent"; // Fixed import path
import { AGENT_ROLES } from "./agents/agentRoles"; // Fixed import path

export interface SupplyChainNews {
  id: string;
  title: string;
  content: string;
  published_at: string;
  source_name: string;
  source_url: string;
  tags: string[];
}

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
      const { error } = await supabase.functions.invoke('scrape-news');
      
      if (error) {
        console.error('Error fetching news from edge function:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in fetchAndStoreNews:', error);
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
