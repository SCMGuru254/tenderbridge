import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { MessageCircle, Send, Loader2, User, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface InterviewQuestionCommentsProps {
  questionId: string;
}

export const InterviewQuestionComments = ({ questionId }: InterviewQuestionCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadComments();
  }, [questionId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_question_comments')
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `)
        .eq('question_id', questionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('interview_question_comments')
        .insert({
          question_id: questionId,
          user_id: user.id,
          content: newComment.trim(),
          is_anonymous: isAnonymous
        })
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setComments([...comments, data]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('interview_question_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const displayedComments = expanded ? comments : comments.slice(0, 3);

  return (
    <div className="mt-4 pt-4 border-t">
      {/* Comments Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <MessageCircle className="h-4 w-4" />
        <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
      </button>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading comments...
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>
                    {comment.is_anonymous ? (
                      <User className="h-4 w-4" />
                    ) : (
                      comment.profile?.full_name?.[0] || 'U'
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {comment.is_anonymous ? 'Anonymous' : comment.profile?.full_name || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {comments.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="mt-2"
            >
              {expanded ? 'Show less' : `View all ${comments.length} comments`}
            </Button>
          )}

          {/* Add Comment Form */}
          {user && (
            <div className="mt-4 space-y-3">
              <Textarea
                placeholder="Share your experience or tips..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`anon-${questionId}`}
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Label htmlFor={`anon-${questionId}`} className="text-xs text-muted-foreground">
                    Post anonymously
                  </Label>
                </div>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {!user && (
            <p className="text-sm text-muted-foreground mt-3">
              <a href="/auth" className="text-primary hover:underline">Sign in</a> to add a comment
            </p>
          )}
        </>
      )}
    </div>
  );
};