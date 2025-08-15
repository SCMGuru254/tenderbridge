import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Review } from './Review';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReviewListProps {
  companyId: string;
}

export const ReviewList = ({ companyId }: ReviewListProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('recent'); // 'recent', 'helpful', 'rating'
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadReviews = async () => {
    try {
      let query = supabase
        .from('company_reviews')
        .select('*, reviewer:reviewer_id(full_name)')
        .eq('company_id', companyId)
        .eq('status', 'approved');

      // Apply filters
      switch (filter) {
        case 'helpful':
          query = query.order('helpful_votes', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default: // recent
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      query = query
        .range((page - 1) * perPage, page * perPage - 1);

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [companyId, filter, page]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Review 
          key={review.id} 
          review={review}
          onVote={loadReviews}
        />
      ))}
    </div>
  );
};
