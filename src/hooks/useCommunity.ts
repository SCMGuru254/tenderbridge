import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type {
  Community,
  CommunityMember,
  CommunityPost,
  CommunityPostComment,
  CommunityTag,
  CommunityWithMembership,
  PostWithAuthor,
  CommentWithAuthor
} from '../types/community';

export function useCommunities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCommunities = useCallback(async (category?: string): Promise<CommunityWithMembership[]> => {
    setLoading(true);
    try {
      let query = supabase
        .from('communities')
        .select(`
          *,
          community_members!inner(role)
        `);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(community => ({
        ...community,
        currentUserRole: community.community_members?.[0]?.role
      }));
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCommunity = useCallback(async (community: Omit<Community, 'id' | 'memberCount' | 'createdAt' | 'updatedAt'>): Promise<Community | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communities')
        .insert([community])
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

  return { getCommunities, createCommunity, loading, error };
}

export function useCommunityMembership() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const joinCommunity = useCallback(async (communityId: string, userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('community_members')
        .insert([{
          community_id: communityId,
          user_id: userId,
          role: 'member'
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

  const leaveCommunity = useCallback(async (communityId: string, userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
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

  return { joinCommunity, leaveCommunity, loading, error };
}

export function useCommunityPosts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPosts = useCallback(async (communityId: string): Promise<PostWithAuthor[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:users(id, name, avatar_url),
          tags:community_post_tags(
            tag:community_tags(*)
          )
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(post => ({
        ...post,
        author: post.author,
        tags: post.tags.map((t: any) => t.tag)
      }));
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (post: Omit<CommunityPost, 'id' | 'likesCount' | 'commentsCount' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([post])
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

  const toggleReaction = useCallback(async (postId: string, userId: string, reactionType: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('community_post_reactions')
        .select()
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('community_post_reactions')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('community_post_reactions')
          .insert([{
            post_id: postId,
            user_id: userId,
            reaction_type: reactionType
          }]);

        if (error) throw error;
      }

      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getPosts, createPost, toggleReaction, loading, error };
}

export function useCommunityComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getComments = useCallback(async (postId: string): Promise<CommentWithAuthor[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_post_comments')
        .select(`
          *,
          author:users(id, name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const comments = data.map(comment => ({
        ...comment,
        author: comment.author,
        replies: []
      }));

      // Organize comments into threads
      const threads: CommentWithAuthor[] = [];
      const commentMap = new Map<string, CommentWithAuthor>();

      comments.forEach(comment => {
        commentMap.set(comment.id, comment);
        if (comment.parentCommentId) {
          const parent = commentMap.get(comment.parentCommentId);
          if (parent) {
            if (!parent.replies) parent.replies = [];
            parent.replies.push(comment);
          }
        } else {
          threads.push(comment);
        }
      });

      return threads;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createComment = useCallback(async (comment: Omit<CommunityPostComment, 'id' | 'likesCount' | 'createdAt' | 'updatedAt'>): Promise<CommunityPostComment | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_post_comments')
        .insert([comment])
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

  return { getComments, createComment, loading, error };
}

export function useCommunityTags() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getTags = useCallback(async (communityId: string): Promise<CommunityTag[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_tags')
        .select('*')
        .eq('community_id', communityId);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = useCallback(async (tag: Omit<CommunityTag, 'id' | 'createdAt'>): Promise<CommunityTag | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_tags')
        .insert([tag])
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

  return { getTags, createTag, loading, error };
}
