import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useAnonymousContent } from '@/hooks/useAnonymousContent';
import type { ReviewComment } from '@/types/features';

interface UseReviewCommentsOptions {
  reviewId: string;
  includeReplies?: boolean;
}

interface UseReviewCommentsResult {
  comments: ReviewComment[];
  isLoading: boolean;
  error: Error | null;
  addComment: (text: string, parentId?: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  updateComment: (commentId: string, text: string) => Promise<void>;
}

export const useReviewComments = (options: UseReviewCommentsOptions): UseReviewCommentsResult => {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { isAnonymous } = useAnonymousContent();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from('review_comments')
          .select(`
            *,
            author:profiles!review_comments_user_id_fkey(
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('review_id', options.reviewId)
          .eq('status', 'active');

        if (options.includeReplies) {
          query = query.order('created_at', { ascending: true });
        } else {
          query = query.is('parent_comment_id', null);
        }

        const { data, error: commentsError } = await query;
        if (commentsError) throw commentsError;

        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch comments'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [options.reviewId, options.includeReplies]);

  const addComment = async (text: string, parentId?: string) => {
    try {
      if (!user) throw new Error('Must be logged in to comment');

      const { data: comment, error } = await supabase
        .from('review_comments')
        .insert({
          review_id: options.reviewId,
          user_id: user.id,
          comment_text: text,
          parent_comment_id: parentId,
          is_anonymous: isAnonymous
        })
        .select(`
          *,
          author:profiles!review_comments_user_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev => [comment, ...prev]);
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err instanceof Error ? err : new Error('Failed to add comment');
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      if (!user) throw new Error('Must be logged in to delete comment');

      const { error } = await supabase
        .from('review_comments')
        .update({ status: 'hidden' })
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw err instanceof Error ? err : new Error('Failed to delete comment');
    }
  };

  const updateComment = async (commentId: string, text: string) => {
    try {
      if (!user) throw new Error('Must be logged in to update comment');

      const { data: comment, error } = await supabase
        .from('review_comments')
        .update({ comment_text: text })
        .eq('id', commentId)
        .eq('user_id', user.id)
        .select(`
          *,
          author:profiles!review_comments_user_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev =>
        prev.map(c => (c.id === commentId ? comment : c))
      );
    } catch (err) {
      console.error('Error updating comment:', err);
      throw err instanceof Error ? err : new Error('Failed to update comment');
    }
  };

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    updateComment
  };
};