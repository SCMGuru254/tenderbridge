
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './useUser';
import { toast } from 'sonner';

export const useRewards = () => {
  const { user } = useUser();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserPoints();
    }
  }, [user]);

  const fetchUserPoints = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('rewards_points')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();

      setPoints(data?.current_balance || 0);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const awardPoints = async (
    pointsToAward: number, 
    description: string, 
    source: string,
    referenceId?: string
  ) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('award_points', {
        p_user_id: user.id,
        p_points: pointsToAward,
        p_description: description,
        p_source: source,
        p_reference_id: referenceId || null
      });

      if (error) throw error;

      await fetchUserPoints(); // Refresh points
      toast.success(`Earned ${pointsToAward} points! ${description}`);
      return true;
    } catch (error: any) {
      console.error('Error awarding points:', error);
      toast.error('Failed to award points');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Specific point awarding functions
  const awardJobApplicationPoints = async (jobId: string) => {
    return await awardPoints(10, 'Job application completed', 'job_application', jobId);
  };

  const awardProfileCompletionPoints = async () => {
    return await awardPoints(50, 'Profile completion milestone', 'profile_completion');
  };

  const awardFirstJobPlacementPoints = async (jobId: string) => {
    return await awardPoints(500, 'First successful job placement', 'job_placement', jobId);
  };

  const awardReferralPoints = async (referredUserId: string) => {
    return await awardPoints(100, 'Successful referral bonus', 'referral', referredUserId);
  };

  const awardDailyLoginPoints = async () => {
    return await awardPoints(5, 'Daily login bonus', 'daily_login');
  };

  return {
    points,
    loading,
    awardPoints,
    awardJobApplicationPoints,
    awardProfileCompletionPoints,
    awardFirstJobPlacementPoints,
    awardReferralPoints,
    awardDailyLoginPoints,
    fetchUserPoints
  };
};
