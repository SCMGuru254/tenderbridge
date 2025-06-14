import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Connection, ProfessionalRecommendation, ConnectionSuggestion } from '@/types/networking';

interface NetworkingConnection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: string;
  message?: string;
  created_at: string;
}

interface SkillEndorsementData {
  id: string;
  endorser_id: string;
  endorsee_id: string;
  skill: string;
  level: number;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export const useNetworking = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<NetworkingConnection[]>([]);
  const [endorsements, setEndorsements] = useState<any[]>([]);
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

export const useConnections = (_userId: string) => {
  const connections: Connection[] = [];
  const isLoading = false;

  const sendConnectionRequest = async (targetId: string) => {
    try {
      // Simulate connection request
      console.log('Sending connection request to:', targetId);
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const respondToRequest = async ({ connectionId, status }: { connectionId: string; status: string }) => {
    try {
      // Simulate responding to connection request
      console.log('Responding to connection:', connectionId, status);
    } catch (error) {
      console.error('Error responding to connection:', error);
    }
  };

  return { connections, isLoading, sendConnectionRequest, respondToRequest };
};

export const useConnectionSuggestions = (userId: string) => {
  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [isLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      // Simulate loading suggestions
      setSuggestions([]);
    }
  }, [userId]);

  return { suggestions, isLoading };
};

export const useEndorsements = (userId: string) => {
  const [receivedEndorsements, setReceivedEndorsements] = useState<SkillEndorsementData[]>([]);
  const [loadingReceived, setLoadingReceived] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoadingReceived(true);
      // Simulate loading endorsements
      setTimeout(() => {
        setReceivedEndorsements([]);
        setLoadingReceived(false);
      }, 1000);
    }
  }, [userId]);

  return { receivedEndorsements, loadingReceived };
};

export const useRecommendations = (userId: string) => {
  const [recommendations, setRecommendations] = useState<ProfessionalRecommendation[]>([]);
  const [isLoading] = useState(false);

  const writeRecommendation = async (data: Partial<ProfessionalRecommendation>) => {
    try {
      // Simulate writing recommendation
      console.log('Writing recommendation:', data);
    } catch (error) {
      console.error('Error writing recommendation:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      setRecommendations([]);
    }
  }, [userId]);

  return { recommendations, isLoading, writeRecommendation };
};
