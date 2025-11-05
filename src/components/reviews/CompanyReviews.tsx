import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewForm, type ReviewFormValues } from "./ReviewForm.tsx";
import { ReviewList } from "./ReviewList.tsx";
import { ReviewStats } from "./ReviewStats.tsx";
import { ReviewFilters } from "./ReviewFilters";
import type { ReviewFilters as ReviewFiltersType } from "./ReviewFilters";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { checkRateLimit } from '@/utils/rateLimit';

export const CompanyReviews = () => {
  const { companyId } = useParams();
  const { user } = useAuth();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ReviewFiltersType>({
    sortBy: 'date',
    rating: null,
    employmentStatus: 'all'
  });
  const { addToast } = useToast();
  const ITEMS_PER_PAGE = 10;

  // Fetch reviews for the company
  const fetchReviews = async () => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      // Get total count first
      const { count } = await supabase
        .from('company_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('is_active', true)
        .eq('status', 'approved');

      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

      // Then get paginated data
      let query = supabase
        .from('company_reviews')
        .select(`
          *,
          reviewer:reviewer_id(
            display_name,
            avatar_url
          ),
          votes:review_votes(count)
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .eq('status', 'approved');

      // Apply rating filter if set
      if (filters.rating !== null) {
        query = query.gte('rating', filters.rating);
      }

      // Apply employment status filter
      if (filters.employmentStatus !== 'all') {
        query = query.eq('employment_status', filters.employmentStatus);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'date':
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'relevance':
          query = query.order('votes_count', { ascending: false })
                      .order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      addToast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews when company ID or page changes
  useEffect(() => {
    fetchReviews();
  }, [companyId, currentPage]);

  // Handlers for voting/reporting
  const handleVote = async (reviewId: string, helpful: boolean) => {
    if (!user) {
      addToast({
        title: "Authentication Required",
        description: "Please login to vote on reviews",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check rate limit first
      const { success } = await checkRateLimit(`review_vote_${user.id}`);

      if (!success) {
        addToast({
          title: "Rate Limited",
          description: "Please wait before voting again",
          variant: "destructive"
        });
        return;
      }

      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('review_votes')
        .select('id, vote_type')
        .eq('review_id', reviewId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if ((existingVote.vote_type === 'upvote') === helpful) {
          // Remove the vote if clicking the same type again
          const { error } = await supabase
            .from('review_votes')
            .delete()
            .eq('id', existingVote.id);

          if (error) throw error;
        } else {
          // Update the vote if changing vote type
          const { error } = await supabase
            .from('review_votes')
            .update({ vote_type: helpful ? 'upvote' : 'downvote' })
            .eq('id', existingVote.id);

          if (error) throw error;
        }
      } else {
        // Create new vote
        const { error } = await supabase
          .from('review_votes')
          .insert({
            review_id: reviewId,
            user_id: user.id,
            vote_type: helpful ? 'upvote' : 'downvote'
          });

        if (error) throw error;
      }

      // Refresh the reviews to get updated vote counts
      await fetchReviews();

      addToast({
        title: "Vote Recorded",
        description: "Your vote has been saved",
        variant: "success"
      });
    } catch (error) {
      console.error('Error voting on review:', error);
      addToast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler for submitting a review
  const handleSubmitReview = async (data: ReviewFormValues) => {
    if (!user) {
      addToast({
        title: "Authentication Required",
        description: "Please login to submit a review",
        variant: "destructive"
      });
      return;
    }

    try {
      const reviewData = {
        company_id: companyId,
        reviewer_id: user.id,
        title: data.title,
        review_text: data.review_text,
        rating: data.rating,
        position: data.position,
        employment_status: data.employment_status,
        employment_period: data.employment_period,
        location: data.location,
        work_life_balance: data.work_life_balance,
        salary_benefits: data.salary_benefits,
        job_security: data.job_security,
        management: data.management,
        culture: data.culture,
        career_growth: data.career_growth,
        pros: data.pros,
        cons: data.cons,
        is_anonymous: data.anonymous,
        status: 'pending',
        created_at: new Date().toISOString(),
        is_active: true
      };

      const { error } = await supabase
        .from('company_reviews')
        .insert([reviewData]);

      if (error) throw error;

      addToast({
        title: "Review Submitted",
        description: "Your review is pending approval",
        variant: "success"
      });

      setIsAddingReview(false);
      await fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      addToast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Only pass companyId if defined
  const safeCompanyId = companyId || '';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Company Reviews</h2>
        {user && (
          <Button onClick={() => setIsAddingReview(true)}>
            Write a Review
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar with statistics */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <ReviewStats companyId={safeCompanyId} />
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <ReviewFilters
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1); // Reset to first page when filters change
              }}
            />
          </div>
          {isAddingReview ? (
            <Card>
              <CardContent className="p-6">
                <ReviewForm 
                  onSubmit={handleSubmitReview}
                  onCancel={() => setIsAddingReview(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <ReviewList 
              reviews={reviews}
              loading={loading}
              onVote={handleVote}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
