
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyEvent, CompanyMember, CompanyUpdate } from '@/types/careers';

export const useCompany = (companyId?: string) => {
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [teamMembers, setTeamMembers] = useState<CompanyMember[]>([]);
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_events')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false });
      
      if (!error && data) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    if (!companyId) return;
    try {
      const { data, error } = await supabase
        .from('company_team_members')
        .select('*')
        .eq('company_id', companyId);
      
      if (!error && data) {
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchUpdates = async () => {
    if (!companyId) return;
    try {
      const { data, error } = await supabase
        .from('company_updates')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setUpdates(data);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const createEvent = async (event: Partial<CompanyEvent>) => {
    if (!companyId) return null;
    try {
      const { data, error } = await supabase
        .from('company_events')
        .insert([{ ...event, company_id: companyId }])
        .select()
        .single();
      
      if (!error && data) {
        setEvents(prev => [data, ...prev]);
        return data;
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
    return null;
  };

  const createTeamMember = async (member: Partial<CompanyMember>) => {
    if (!companyId) return null;
    try {
      const { data, error } = await supabase
        .from('company_team_members')
        .insert([{ ...member, company_id: companyId }])
        .select()
        .single();
      
      if (!error && data) {
        setTeamMembers(prev => [...prev, data]);
        return data;
      }
    } catch (error) {
      console.error('Error creating team member:', error);
    }
    return null;
  };

  const createUpdate = async (update: Partial<CompanyUpdate>) => {
    if (!companyId) return null;
    try {
      const { data, error } = await supabase
        .from('company_updates')
        .insert([{ ...update, company_id: companyId }])
        .select()
        .single();
      
      if (!error && data) {
        setUpdates(prev => [data, ...prev]);
        return data;
      }
    } catch (error) {
      console.error('Error creating update:', error);
    }
    return null;
  };

  useEffect(() => {
    if (companyId) {
      fetchEvents();
      fetchTeamMembers();
      fetchUpdates();
    }
  }, [companyId]);

  return {
    events,
    teamMembers,
    updates,
    loading,
    createEvent,
    createTeamMember,
    createUpdate,
    refetch: () => {
      fetchEvents();
      fetchTeamMembers();
      fetchUpdates();
    }
  };
};
