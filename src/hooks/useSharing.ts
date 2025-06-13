import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { JobReferral, ShareTemplate, SuccessStory, SharingAnalytics } from '../types/sharing';

export function useReferrals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createReferral = useCallback(async (jobId: string, referredUserId: string, notes?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_referrals')
        .insert([{ jobId, referredUserId, notes }])
        .select()
        .single();
      if (error) throw error;
      return data as JobReferral;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReferralStatus = useCallback(async (referralId: string, status: JobReferral['status']) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_referrals')
        .update({ status })
        .eq('id', referralId)
        .select()
        .single();
      if (error) throw error;
      return data as JobReferral;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createReferral, updateReferralStatus, loading, error };
}

export function useShareTemplates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTemplate = useCallback(async (template: Omit<ShareTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('share_templates')
        .insert([template])
        .select()
        .single();
      if (error) throw error;
      return data as ShareTemplate;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplates = useCallback(async (type?: ShareTemplate['templateType']) => {
    setLoading(true);
    try {
      let query = supabase.from('share_templates').select('*');
      if (type) query = query.eq('templateType', type);
      const { data, error } = await query;
      if (error) throw error;
      return data as ShareTemplate[];
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTemplate, getTemplates, loading, error };
}

export function useSuccessStories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createStory = useCallback(async (story: Omit<SuccessStory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('success_stories')
        .insert([story])
        .select()
        .single();
      if (error) throw error;
      return data as SuccessStory;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPublicStories = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .eq('isPublic', true);
      if (error) throw error;
      return data as SuccessStory[];
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createStory, getPublicStories, loading, error };
}

export function useSharingAnalytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const trackShare = useCallback(async (analytics: Omit<SharingAnalytics, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sharing_analytics')
        .insert([analytics])
        .select()
        .single();
      if (error) throw error;
      return data as SharingAnalytics;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAnalytics = useCallback(async (contentType?: SharingAnalytics['contentType']) => {
    setLoading(true);
    try {
      let query = supabase.from('sharing_analytics').select('*');
      if (contentType) query = query.eq('contentType', contentType);
      const { data, error } = await query;
      if (error) throw error;
      return data as SharingAnalytics[];
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { trackShare, getAnalytics, loading, error };
}
