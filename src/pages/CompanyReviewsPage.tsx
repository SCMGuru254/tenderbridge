import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReviewStats } from '@/components/reviews/ReviewStats';
import { ReviewForm, ReviewFormValues } from '@/components/reviews/ReviewForm';
import type { ReviewData } from '@/services/reviewService';
import { ReviewList } from '@/components/reviews/ReviewList';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { reviewService } from '@/services/reviewService';
import { useAuth } from '@/hooks/useAuth';

export const CompanyReviewsPage = () => {
  const { companyId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { reviews: data, total } = await reviewService.getCompanyReviews(companyId!, {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        filterStatus: 'approved'
      });
      setReviews(data || []);
      setTotalReviews(total);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadReviews();
    }
  }, [companyId, page, sortBy, sortOrder]);

  const handleSubmitReview = async (reviewData: ReviewFormValues) => {
    try {
      await reviewService.createReview({
        ...reviewData,
        company_id: companyId!,
        reviewer_id: user!.id,
        status: 'pending'
      });
      toast({
        title: 'Success',
        description: 'Your review has been submitted and is pending approval.',
      });
      setShowForm(false);
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleVote = async (reviewId: string, helpful: boolean) => {
    try {
      await reviewService.voteReview(reviewId, helpful);
      loadReviews();
    } catch (error) {
      console.error('Error voting on review:', error);
      toast({
        title: 'Error',
        description: 'Failed to record your vote. Please try again.',
        variant: 'destructive'
      });
    }
  };



  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <ReviewStats companyId={companyId!} />
          {user && (
            <Button
              className="w-full mt-4"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Hide Review Form' : 'Write a Review'}
            </Button>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Reviews ({totalReviews})
            </h2>
            <div className="flex gap-2">
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Most Recent</SelectItem>
                  <SelectItem value="helpful_votes">Most Helpful</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortOrder}
                onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {user && showForm && (
            <div className="mb-8">
              <ReviewForm
                onSubmit={handleSubmitReview}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <ReviewList
            reviews={reviews}
            loading={loading}
            onVote={handleVote}
            currentPage={page}
            totalPages={Math.ceil(totalReviews / 10)}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};
