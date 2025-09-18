import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ThumbsUp, 
  MessageSquare, 
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReviewComment {
  id: string;
  comment_text: string;
  created_at: string;
  user_id: string;
  parent_comment_id?: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ReviewLike {
  id: string;
  liked: boolean;
  user_id: string;
}

interface ReviewInteractionsProps {
  reviewId: string;
  className?: string;
}

export const ReviewInteractions = ({ 
  reviewId, 
  className = "" 
}: ReviewInteractionsProps) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState<ReviewLike[]>([]);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLike, setUserLike] = useState<ReviewLike | null>(null);

  useEffect(() => {
    loadLikes();
    loadComments();
  }, [reviewId]);

  const loadLikes = async () => {
    try {
      const { data, error } = await supabase
        .from('review_likes')
        .select('*')
        .eq('review_id', reviewId);

      if (error) throw error;
      
      setLikes(data || []);
      
      // Check if current user has liked
      const currentUserLike = data?.find(like => like.user_id === user?.id);
      setUserLike(currentUserLike || null);
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('review_comments')
        .select(`
          *,
          profiles:profiles(full_name, avatar_url)
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like reviews');
      return;
    }

    try {
      if (userLike) {
        // Toggle like
        const { error } = await supabase
          .from('review_likes')
          .update({ liked: !userLike.liked })
          .eq('id', userLike.id);

        if (error) throw error;
      } else {
        // Create new like
        const { error } = await supabase
          .from('review_likes')
          .insert({
            review_id: reviewId,
            user_id: user.id,
            liked: true
          });

        if (error) throw error;
      }

      loadLikes();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: user.id,
          comment_text: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      loadComments();
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const likesCount = likes.filter(like => like.liked).length;
  const isLiked = userLike?.liked || false;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Like and Comment Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLike}
            className={isLiked ? 'text-primary' : ''}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {likesCount > 0 && <span>{likesCount}</span>}
            Helpful
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            {comments.length > 0 && <span>{comments.length}</span>}
            Comments
            {showComments ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {likesCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {likesCount} helpful vote{likesCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4 border-t pt-4">
          {/* New Comment Form */}
          {user && (
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts or ask a question about this review..."
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={!newComment.trim() || isSubmitting}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <Card key={comment.id} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {comment.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {comment.profiles?.full_name || 'Anonymous User'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.comment_text}
                  </p>
                </CardContent>
              </Card>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};