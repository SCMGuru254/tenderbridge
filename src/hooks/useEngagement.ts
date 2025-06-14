
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserReputation, ReputationCategory, UserAchievement } from '@/types/engagement';
import { useAuth } from './useAuth';

export const useEngagement = () => {
  const { user } = useAuth();
  const [reputation, setReputation] = useState<Record<string, ReputationCategory>>({});
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReputation = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reputation')
        .select('*')
        .eq('user_id', user.id);
      
      if (!error && data) {
        const reputationMap: Record<string, ReputationCategory> = {};
        data.forEach((rep: UserReputation) => {
          reputationMap[rep.category] = {
            name: rep.category,
            score: rep.score,
            lastUpdated: rep.last_updated
          };
        });
        setReputation(reputationMap);
      }
    } catch (error) {
      console.error('Error fetching reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });
      
      if (!error && data) {
        setAchievements(data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReputation();
      fetchAchievements();
    }
  }, [user]);

  return {
    reputation,
    achievements,
    loading,
    refetch: () => {
      fetchReputation();
      fetchAchievements();
    }
  };
};
