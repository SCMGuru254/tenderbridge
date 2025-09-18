import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ReviewVoteButtonsProps {
  reviewId: string;
  upvotes: number;
  downvotes: number;
  userVote: 'upvote' | 'downvote' | null;
  onVote: (reviewId: string, helpful: boolean) => Promise<void>;
  disabled?: boolean;
}

export const ReviewVoteButtons: React.FC<ReviewVoteButtonsProps> = ({
  reviewId,
  upvotes,
  downvotes,
  userVote,
  onVote,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={userVote === 'upvote' ? 'default' : 'outline'}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onVote(reviewId, true)}
        disabled={disabled}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{upvotes}</span>
      </Button>

      <Button
        variant={userVote === 'downvote' ? 'default' : 'outline'}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onVote(reviewId, false)}
        disabled={disabled}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{downvotes}</span>
      </Button>
    </div>
  );
};