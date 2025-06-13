import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Connection, SkillEndorsement, ProfessionalRecommendation, ConnectionSuggestion } from '@/types/networking';

export const useConnections = (userId: string) => {
  const queryClient = useQueryClient();

  // Fetch user's connections
  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['connections', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professional_connections')
        .select('*')
        .or(`requestor_id.eq.${userId},target_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Connection[];
    },
  });

  // Send connection request
  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: async (targetId: string) => {
      const { error } = await supabase
        .from('professional_connections')
        .insert({
          requestor_id: userId,
          target_id: targetId,
          status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['connections']);
      toast.success('Connection request sent successfully');
    },
    onError: (error) => {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    },
  });

  // Respond to connection request
  const { mutate: respondToRequest } = useMutation({
    mutationFn: async ({ connectionId, status }: { connectionId: string; status: 'accepted' | 'rejected' }) => {
      const { error } = await supabase
        .from('professional_connections')
        .update({ status })
        .eq('id', connectionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['connections']);
      toast.success('Connection request updated successfully');
    },
    onError: (error) => {
      console.error('Error updating connection request:', error);
      toast.error('Failed to update connection request');
    },
  });

  return {
    connections,
    isLoading,
    sendConnectionRequest,
    respondToRequest,
  };
};

export const useEndorsements = (userId: string) => {
  const queryClient = useQueryClient();

  // Fetch endorsements received by user
  const { data: receivedEndorsements = [], isLoading: loadingReceived } = useQuery({
    queryKey: ['endorsements', 'received', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_endorsements')
        .select('*, profiles!endorser_id(*)')
        .eq('endorsed_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (SkillEndorsement & { profiles: any })[];
    },
  });

  // Endorse a user's skill
  const { mutate: endorseSkill } = useMutation({
    mutationFn: async ({ endorsedId, skill, level }: { endorsedId: string; skill: string; level: number }) => {
      const { error } = await supabase
        .from('skill_endorsements')
        .insert({
          endorser_id: userId,
          endorsed_id: endorsedId,
          skill,
          level,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['endorsements']);
      toast.success('Skill endorsed successfully');
    },
    onError: (error) => {
      console.error('Error endorsing skill:', error);
      toast.error('Failed to endorse skill');
    },
  });

  return {
    receivedEndorsements,
    loadingReceived,
    endorseSkill,
  };
};

export const useRecommendations = (userId: string) => {
  const queryClient = useQueryClient();

  // Fetch recommendations for user
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['recommendations', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professional_recommendations')
        .select('*, profiles!recommender_id(*)')
        .eq('recommended_id', userId)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (ProfessionalRecommendation & { profiles: any })[];
    },
  });

  // Write a recommendation
  const { mutate: writeRecommendation } = useMutation({
    mutationFn: async ({
      recommendedId,
      content,
      relationship,
      duration,
    }: {
      recommendedId: string;
      content: string;
      relationship: string;
      duration: string;
    }) => {
      const { error } = await supabase
        .from('professional_recommendations')
        .insert({
          recommender_id: userId,
          recommended_id: recommendedId,
          content,
          relationship,
          duration,
          status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recommendations']);
      toast.success('Recommendation submitted successfully');
    },
    onError: (error) => {
      console.error('Error submitting recommendation:', error);
      toast.error('Failed to submit recommendation');
    },
  });

  // Update recommendation status
  const { mutate: updateRecommendationStatus } = useMutation({
    mutationFn: async ({ recommendationId, status }: { recommendationId: string; status: 'published' | 'rejected' }) => {
      const { error } = await supabase
        .from('professional_recommendations')
        .update({ status })
        .eq('id', recommendationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recommendations']);
      toast.success('Recommendation status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating recommendation status:', error);
      toast.error('Failed to update recommendation status');
    },
  });

  return {
    recommendations,
    isLoading,
    writeRecommendation,
    updateRecommendationStatus,
  };
};

export const useConnectionSuggestions = (userId: string) => {
  // Fetch connection suggestions
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['connection-suggestions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_connection_suggestions', { user_id_param: userId, limit_param: 10 });

      if (error) throw error;
      return data as ConnectionSuggestion[];
    },
  });

  return {
    suggestions,
    isLoading,
  };
};
