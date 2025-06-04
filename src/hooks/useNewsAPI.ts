
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNewsAPI = () => {
  const [loading, setLoading] = useState(false);

  const fetchSupplyChainNews = async (searchTerm: string = '', limit: number = 50) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('news-api-integration', {
        body: { searchTerm, limit }
      });

      if (error) throw error;

      toast.success(`Fetched ${data.count} supply chain news articles`);
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch latest news');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchSupplyChainNews,
    loading
  };
};
