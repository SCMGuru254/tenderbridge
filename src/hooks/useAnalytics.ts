import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  UserAnalytics,
  JobAnalytics,
  SocialAnalytics,
  ABTest,
  UserSegment,
  PerformanceMetric,
  AnalyticsSummary
} from '../types/analytics';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track user behavior
  const trackUserAction = useCallback(async (
    page_view: string,
    action_type: string,
    action_details?: Record<string, any>
  ) => {
    try {
      const session_id = localStorage.getItem('session_id') || crypto.randomUUID();
      localStorage.setItem('session_id', session_id);

      const { error } = await supabase.from('user_analytics').insert({
        page_view,
        action_type,
        action_details,
        session_id
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error tracking user action:', err);
      setError(err as Error);
    }
  }, []);

  // Track job interactions
  const trackJobInteraction = useCallback(async (
    job_id: string,
    interaction_type: string,
    duration?: number,
    conversion_status?: string
  ) => {
    try {
      const { error } = await supabase.from('job_analytics').insert({
        job_id,
        interaction_type,
        duration,
        conversion_status
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error tracking job interaction:', err);
      setError(err as Error);
    }
  }, []);

  // Get analytics summary
  const getAnalyticsSummary = useCallback(async (
    startDate: string,
    endDate: string
  ): Promise<AnalyticsSummary[]> => {
    try {
      const { data, error } = await supabase
        .from('analytics_summary')
        .select('*')
        .gte('day', startDate)
        .lte('day', endDate);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching analytics summary:', err);
      setError(err as Error);
      return [];
    }
  }, []);

  // Get A/B test results
  const getABTestResults = useCallback(async (
    test_name: string
  ): Promise<ABTest[]> => {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .eq('test_name', test_name);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching A/B test results:', err);
      setError(err as Error);
      return [];
    }
  }, []);

  // Get social analytics
  const getSocialAnalytics = useCallback(async (
    feature_type: string,
    timeRange: [string, string]
  ): Promise<SocialAnalytics[]> => {
    try {
      const { data, error } = await supabase
        .from('social_analytics')
        .select('*')
        .eq('feature_type', feature_type)
        .overlaps('time_period', timeRange);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching social analytics:', err);
      setError(err as Error);
      return [];
    }
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(async (
    metric_type: string,
    component?: string
  ): Promise<PerformanceMetric[]> => {
    try {
      let query = supabase
        .from('performance_metrics')
        .select('*')
        .eq('metric_type', metric_type);

      if (component) {
        query = query.eq('component', component);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      setError(err as Error);
      return [];
    }
  }, []);

  return {
    isLoading,
    error,
    trackUserAction,
    trackJobInteraction,
    getAnalyticsSummary,
    getABTestResults,
    getSocialAnalytics,
    getPerformanceMetrics
  };
};
