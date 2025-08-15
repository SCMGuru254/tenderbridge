import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';


interface ReviewProps {
  review: any;
  onVote: (reviewId: string, helpful: boolean) => Promise<void>;
}

export const Review = ({ review, onVote }: ReviewProps) => {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleVote = async (helpful: boolean) => {
    if (!user) {
      toast.error('Please sign in to vote on reviews');
      return;
    }

    setIsVoting(true);
    try {
      await onVote(review.id, helpful);
    } catch (error) {
      console.error('Error voting on review:', error);
      toast.error('Failed to record vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleReport = async () => {
    if (!user) {
      toast.error('Please sign in to report reviews');
      return;
    }

    setIsReporting(true);
    try {
      const { error } = await supabase
        .from('review_reports')
        .insert({
          review_id: review.id,
          reporter_id: user.id,
          reason: 'inappropriate', // You might want to add a reason selection UI
          details: 'Reported as inappropriate' // You might want to add a details input
        });

      if (error) throw error;
      toast.success('Review reported successfully');
    } catch (error) {
      console.error('Error reporting review:', error);
      toast.error('Failed to report review');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">{review.title}</h3>
              <p className="text-sm text-muted-foreground">
                {review.anonymous ? 'Anonymous' : review.reviewer.full_name} • {review.position} • {review.location}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{review.rating}/5</div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(review.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Review</p>
            <p className="text-muted-foreground">{review.review_text}</p>
          </div>

          {(review.pros || review.cons) && (
            <div className="grid grid-cols-2 gap-4">
              {review.pros && (
                <div>
                  <p className="font-medium text-green-600">Pros</p>
                  <p className="text-sm">{review.pros}</p>
                </div>
              )}
              {review.cons && (
                <div>
                  <p className="font-medium text-red-600">Cons</p>
                  <p className="text-sm">{review.cons}</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Work/Life Balance</p>
              <p className="text-muted-foreground">{review.work_life_balance}/5</p>
            </div>
            <div>
              <p className="text-sm font-medium">Salary & Benefits</p>
              <p className="text-muted-foreground">{review.salary_benefits}/5</p>
            </div>
            <div>
              <p className="text-sm font-medium">Job Security</p>
              <p className="text-muted-foreground">{review.job_security}/5</p>
            </div>
            <div>
              <p className="text-sm font-medium">Management</p>
              <p className="text-muted-foreground">{review.management}/5</p>
            </div>
            <div>
              <p className="text-sm font-medium">Culture</p>
              <p className="text-muted-foreground">{review.culture}/5</p>
            </div>
            <div>
              <p className="text-sm font-medium">Career Growth</p>
              <p className="text-muted-foreground">{review.career_growth}/5</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(true)}
                disabled={isVoting}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful ({review.helpful_votes})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(false)}
                disabled={isVoting}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReport}
              disabled={isReporting}
            >
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
