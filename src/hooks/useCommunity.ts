
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Community } from '@/types/community';

export const useCommunity = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCommunities = async (category?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (!error && data) {
        setCommunities(data);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (community: Partial<Community>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('communities')
        .insert([{ ...community, created_by: user.id }])
        .select()
        .single();
      
      if (!error && data) {
        setCommunities(prev => [data, ...prev]);
        return data;
      }
    } catch (error) {
      console.error('Error creating community:', error);
    }
    return null;
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return {
    communities,
    loading,
    createCommunity,
    fetchCommunities
  };
};
