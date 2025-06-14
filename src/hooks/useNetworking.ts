
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface NetworkingConnection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: string;
  message?: string;
  created_at: string;
}

interface SkillEndorsement {
  id: string;
  endorser_id: string;
  endorsee_id: string;
  skill: string;
  created_at: string;
}

export const useNetworking = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<NetworkingConnection[]>([]);
  const [endorsements, setEndorsements] = useState<SkillEndorsement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('networking_connections')
        .select('*')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);
      
      if (!error && data) {
        setConnections(data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConnection = async (recipientId: string, message?: string) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('networking_connections')
        .insert([{
          requester_id: user.id,
          recipient_id: recipientId,
          message,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (!error && data) {
        setConnections(prev => [...prev, data]);
        return data;
      }
    } catch (error) {
      console.error('Error creating connection:', error);
    }
    return null;
  };

  const endorseSkill = async (endorseeId: string, skill: string) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('skill_endorsements')
        .insert([{
          endorser_id: user.id,
          endorsee_id: endorseeId,
          skill
        }])
        .select()
        .single();
      
      if (!error && data) {
        setEndorsements(prev => [...prev, data]);
        return data;
      }
    } catch (error) {
      console.error('Error endorsing skill:', error);
    }
    return null;
  };

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  return {
    connections,
    endorsements,
    loading,
    createConnection,
    endorseSkill,
    refetch: fetchConnections
  };
};
