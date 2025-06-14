import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Community, CommunityWithMembership, CommunityPost } from '@/types/community';

export const useCommunity = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCommunities = async (category?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (!error && data) {
        setCommunities(data);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (community: Partial<Community>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('communities')
        .insert([{ ...community, created_by: user.id }])
        .select()
        .single();
      
      if (!error && data) {
        setCommunities(prev => [data, ...prev]);
        return data;
      }
    } catch (error) {
      console.error('Error creating community:', error);
    }
    return null;
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return {
    communities,
    loading,
    createCommunity,
    fetchCommunities
  };
};

export const useCommunities = () => {
  const [error, setError] = useState<string | null>(null);

  const getCommunities = async (category?: string): Promise<CommunityWithMembership[]> => {
    setError(null);
    try {
      let query = supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        setError(error.message);
        return [];
      }

      return (data || []).map(community => ({
        ...community,
        memberCount: community.member_count || 0,
        isPrivate: community.is_private || false,
      }));
    } catch (err) {
      setError('Failed to fetch communities');
      return [];
    }
  };

  return { getCommunities, error };
};

export const useCommunityMembership = () => {
  const joinCommunity = async (communityId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('community_members')
        .insert([{ community_id: communityId, user_id: userId, role: 'member' }]);
      
      return !error;
    } catch (error) {
      console.error('Error joining community:', error);
      return false;
    }
  };

  const leaveCommunity = async (communityId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);
      
      return !error;
    } catch (error) {
      console.error('Error leaving community:', error);
      return false;
    }
  };

  return { joinCommunity, leaveCommunity };
};

export const useCommunityPosts = (communityId: string) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);

  const createPost = async (postData: Partial<CommunityPost>) => {
    try {
      // Simulated post creation - would connect to actual database
      const newPost: CommunityPost = {
        id: Math.random().toString(),
        title: postData.title || '',
        content: postData.content || '',
        author: postData.author || '',
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        tags: postData.tags || []
      };
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  };

  useEffect(() => {
    setPosts([]);
  }, [communityId]);

  return { posts, loading, createPost };
};
