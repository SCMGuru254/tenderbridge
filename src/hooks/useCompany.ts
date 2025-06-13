import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type {
  CompanyProfile,
  CompanyUpdate,
  CompanyFollower,
  CompanyTeamMember,
  CompanyEvent,
  CompanyEventRegistration,
  CompanyProfileWithStats
} from '../types/company';

export function useCompanyProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getProfile = useCallback(async (companyId: string): Promise<CompanyProfileWithStats | null> => {
    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (profileError) throw profileError;

      const [
        { count: followersCount },
        { count: teamMembersCount },
        { count: upcomingEventsCount }
      ] = await Promise.all([
        supabase.from('company_followers').select('id', { count: 'exact' }).eq('company_id', companyId),
        supabase.from('company_team_members').select('id', { count: 'exact' }).eq('company_id', companyId),
        supabase.from('company_events')
          .select('id', { count: 'exact' })
          .eq('company_id', companyId)
          .gte('start_time', new Date().toISOString())
      ]);

      return {
        ...profile,
        followersCount: followersCount || 0,
        teamMembersCount: teamMembersCount || 0,
        upcomingEventsCount: upcomingEventsCount || 0
      };
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (
    companyId: string,
    updates: Partial<CompanyProfile>
  ): Promise<CompanyProfile | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .update(updates)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getProfile, updateProfile, loading, error };
}

export function useCompanyUpdates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getUpdates = useCallback(async (companyId: string): Promise<CompanyUpdate[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_updates')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createUpdate = useCallback(async (update: Omit<CompanyUpdate, 'id' | 'likesCount' | 'commentsCount' | 'createdAt' | 'updatedAt'>): Promise<CompanyUpdate | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_updates')
        .insert([update])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getUpdates, createUpdate, loading, error };
}

export function useCompanyFollowers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const followCompany = useCallback(async (companyId: string, userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('company_followers')
        .insert([{ company_id: companyId, user_id: userId }]);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowCompany = useCallback(async (companyId: string, userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('company_followers')
        .delete()
        .eq('company_id', companyId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { followCompany, unfollowCompany, loading, error };
}

export function useCompanyEvents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getEvents = useCallback(async (companyId: string, includeCompleted = false): Promise<CompanyEvent[]> => {
    setLoading(true);
    try {
      let query = supabase
        .from('company_events')
        .select('*')
        .eq('company_id', companyId)
        .order('start_time', { ascending: true });

      if (!includeCompleted) {
        query = query.gte('end_time', new Date().toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (event: Omit<CompanyEvent, 'id' | 'attendeesCount' | 'createdAt' | 'updatedAt'>): Promise<CompanyEvent | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerForEvent = useCallback(async (eventId: string, userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('company_event_registrations')
        .insert([{
          event_id: eventId,
          user_id: userId,
          status: 'registered'
        }]);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getEvents, createEvent, registerForEvent, loading, error };
}

export function useCompanyTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getTeamMembers = useCallback(async (companyId: string): Promise<CompanyTeamMember[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_team_members')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addTeamMember = useCallback(async (member: Omit<CompanyTeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyTeamMember | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_team_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getTeamMembers, addTeamMember, loading, error };
}
