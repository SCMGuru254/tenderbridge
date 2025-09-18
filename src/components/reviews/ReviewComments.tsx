import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useReviewComments } from '@/hooks/useReviewComments';
import { formatDistance } from 'date-fns';
import { MoreVertical, MessageCircle, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { ReviewComment } from '@/types/features';

interface CommentProps {
  comment: ReviewComment;
  onEdit: (id: string, text: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReply: (parentId: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onEdit,
  onDelete,
  onReply
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment_text);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = async () => {
    try {
      setIsSubmitting(true);
      await onEdit(comment.id, editText);
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canModify = user?.id === comment.user_id;

  return (
    <div className="flex space-x-4">
      <Avatar className="w-10 h-10">
        {comment.is_anonymous ? (
          <AvatarFallback>A</AvatarFallback>
        ) : (
          <>
            <AvatarImage src={comment.author?.avatar_url} />
            <AvatarFallback>
              {comment.author?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">
              {comment.is_anonymous ? 'Anonymous' : comment.author?.full_name}
            </span>
            <span className="mx-2">•</span>
            <span className="text-sm text-muted-foreground">
              {formatDistance(new Date(comment.created_at), new Date(), {
                addSuffix: true
              })}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {canModify && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(comment.id)}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Reply
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={isSubmitting || !editText.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">{comment.comment_text}</p>
        )}
      </div>
    </div>
  );
};

interface ReviewCommentsProps {
  reviewId: string;
}

export const ReviewComments: React.FC<ReviewCommentsProps> = ({ reviewId }) => {
  const {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    updateComment
  } = useReviewComments({ reviewId, includeReplies: true });

  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(newComment, replyTo || undefined);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error loading comments: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-between items-center">
          {replyTo && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setReplyTo(null)}
            >
              Cancel Reply
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center py-4">Loading comments...</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <Comment
                comment={comment}
                onEdit={updateComment}
                onDelete={deleteComment}
                onReply={(id) => setReplyTo(id)}
              />
              {comment.replies?.map((reply) => (
                <div key={reply.id} className="ml-12">
                  <Comment
                    comment={reply}
                    onEdit={updateComment}
                    onDelete={deleteComment}
                    onReply={(id) => setReplyTo(id)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};