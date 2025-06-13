import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type {
  UserActivity,
  UserNotification,
  UserAchievement,
  UserReputation,
  ReputationHistory,
  EngagementMetric,
  UserEngagementSummary
} from '../types/engagement';

export function useEngagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getEngagementMetrics = useCallback(async (userId: string): Promise<EngagementMetric[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_engagement_metrics')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEngagementSummary = useCallback(async (userId: string): Promise<UserEngagementSummary> => {
    setLoading(true);
    try {
      const [
        { count: connections },
        { count: posts },
        { count: comments },
        { count: endorsements },
        { count: applications },
        { data: reputation },
        { data: achievements }
      ] = await Promise.all([
        supabase.from('professional_connections').select('*', { count: 'exact' }).eq('user_id', userId),
        supabase.from('community_posts').select('*', { count: 'exact' }).eq('author_id', userId),
        supabase.from('community_post_comments').select('*', { count: 'exact' }).eq('author_id', userId),
        supabase.from('skill_endorsements').select('*', { count: 'exact' }).eq('endorser_id', userId),
        supabase.from('job_applications').select('*', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_reputation').select('*').eq('user_id', userId),
        supabase.from('user_achievements').select('*').eq('user_id', userId).order('awarded_at', { ascending: false }).limit(5)
      ]);      const reputationByCategory = (reputation || []).reduce<Record<string, UserReputation>>((acc: Record<string, UserReputation>, rep: UserReputation) => {
        acc[rep.category] = rep;
        return acc;
      }, {});

      // Calculate activity streak
      const { data: activities } = await supabase
        .from('user_activity')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      let streak = 0;
      if (activities && activities.length > 0) {
        const dates = new Set(activities.map((a: { created_at: string }) => 
          new Date(a.created_at).toISOString().split('T')[0]
        ));
        const today = new Date();
        let currentDate = today;
        while (dates.has(currentDate.toISOString().split('T')[0])) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }
      }

      return {
        totalConnections: connections || 0,
        totalPosts: posts || 0,
        totalComments: comments || 0,
        totalEndorsements: endorsements || 0,
        totalApplications: applications || 0,
        reputationByCategory,
        recentAchievements: achievements || [],
        activityStreak: streak
      };
    } catch (err) {
      setError(err as Error);
      return {
        totalConnections: 0,
        totalPosts: 0,
        totalComments: 0,
        totalEndorsements: 0,
        totalApplications: 0,
        reputationByCategory: {},
        recentAchievements: [],
        activityStreak: 0
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const getNotifications = useCallback(async (userId: string): Promise<UserNotification[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(async (userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAchievements = useCallback(async (userId: string): Promise<UserAchievement[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getReputation = useCallback(async (userId: string): Promise<UserReputation[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reputation')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getReputationHistory = useCallback(async (userId: string): Promise<ReputationHistory[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reputation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getEngagementMetrics,
    getEngagementSummary,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getAchievements,
    getReputation,
    getReputationHistory
  };
}

export function useActivity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getRecentActivity = useCallback(async (userId: string): Promise<UserActivity[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { getRecentActivity, loading, error };
}
