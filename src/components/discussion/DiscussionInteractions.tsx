import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DiscussionInteractionsProps {
  discussionId: string;
  onCommentAdded?: () => void;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export const DiscussionInteractions = ({ discussionId, onCommentAdded }: DiscussionInteractionsProps) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (discussionId) {
      loadInteractions();
      loadComments();
      checkUserInteractions();
    }
  }, [discussionId, user]);

  const loadInteractions = async () => {
    try {
      // Load likes count
      const { count: likesCount } = await supabase
        .from('discussion_likes')
        .select('*', { count: 'exact' })
        .eq('discussion_id', discussionId);

      // Load shares count
      const { count: sharesCount } = await supabase
        .from('discussion_shares')
        .select('*', { count: 'exact' })
        .eq('discussion_id', discussionId);

      setLikes(likesCount || 0);
      setShares(sharesCount || 0);
    } catch (error) {
      console.error('Error loading interactions:', error);
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('discussion_comments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const checkUserInteractions = async () => {
    if (!user) return;

    try {
      // Check if user liked
      const { data: likeData } = await supabase
        .from('discussion_likes')
        .select('id')
        .eq('discussion_id', discussionId)
        .eq('user_id', user.id)
        .single();

      setIsLiked(!!likeData);

      // Check if user bookmarked
      const { data: bookmarkData } = await supabase
        .from('discussion_bookmarks')
        .select('id')
        .eq('discussion_id', discussionId)
        .eq('user_id', user.id)
        .single();

      setIsBookmarked(!!bookmarkData);
    } catch (error) {
      // Ignore errors as they might be due to no records found
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like discussions');
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', user.id);
        
        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        // Like
        await supabase
          .from('discussion_likes')
          .insert({
            discussion_id: discussionId,
            user_id: user.id
          });
        
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark discussions');
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('discussion_bookmarks')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', user.id);
        
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        // Add bookmark
        await supabase
          .from('discussion_bookmarks')
          .insert({
            discussion_id: discussionId,
            user_id: user.id
          });
        
        setIsBookmarked(true);
        toast.success('Discussion bookmarked');
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = async () => {
    if (!user) {
      toast.error('Please sign in to share discussions');
      return;
    }

    try {
      // Copy to clipboard
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      
      // Record share
      await supabase
        .from('discussion_shares')
        .insert({
          discussion_id: discussionId,
          user_id: user.id,
          platform: 'clipboard'
        });

      setShares(prev => prev + 1);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share discussion');
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('discussion_comments')
        .insert({
          discussion_id: discussionId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      loadComments();
      onCommentAdded?.();
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t pt-4 space-y-4">
      {/* Interaction Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={isLiked ? "default" : "ghost"}
            size="sm"
            onClick={handleLike}
            className="flex items-center gap-1"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
            <span>{shares}</span>
          </Button>

          <Button
            variant={isBookmarked ? "default" : "ghost"}
            size="sm"
            onClick={handleBookmark}
            className="flex items-center gap-1"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Add Comment */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
              rows={2}
            />
            <Button
              onClick={handleAddComment}
              disabled={isLoading || !newComment.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">
                    {comment.profiles?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {comment.profiles?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};