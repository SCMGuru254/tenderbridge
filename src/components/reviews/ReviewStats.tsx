import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ReviewStatsProps {
  companyId: string;
}

export const ReviewStats = ({ companyId }: ReviewStatsProps) => {
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
    categoryAverages: Record<string, number>;
  }>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    categoryAverages: {
      work_life_balance: 0,
      salary_benefits: 0,
      job_security: 0,
      management: 0,
      culture: 0,
      career_growth: 0
    }
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get basic stats
        const { data: reviews, error } = await supabase
          .from('company_reviews')
          .select('rating, work_life_balance, salary_benefits, job_security, management, culture, career_growth')
          .eq('company_id', companyId)
          .eq('status', 'approved');

        if (error) throw error;

        if (reviews && reviews.length > 0) {
          // Calculate averages
          const totalReviews = reviews.length;
          const sumRatings = reviews.reduce((acc, r) => acc + r.rating, 0);
          const averageRating = sumRatings / totalReviews;

          // Calculate rating distribution
          const distribution = reviews.reduce((acc: { 1: number; 2: number; 3: number; 4: number; 5: number }, r) => {
            const rating = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
            acc[rating] = (acc[rating] || 0) + 1;
            return acc;
          }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

          // Calculate category averages
          const categories = [
            'work_life_balance', 
            'salary_benefits', 
            'job_security', 
            'management', 
            'culture', 
            'career_growth'
          ] as const;
          
          const categoryAverages = categories.reduce((acc, cat) => {
            const validRatings = reviews
              .map(r => r[cat])
              .filter((rating): rating is number => typeof rating === 'number');
            
            acc[cat] = validRatings.length > 0
              ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
              : 0;
              
            return acc;
          }, {} as Record<typeof categories[number], number>);

          setStats({
            averageRating,
            totalReviews,
            ratingDistribution: distribution,
            categoryAverages
          });
        }
      } catch (error) {
        console.error('Error loading review stats:', error);
      }
    };

    loadStats();
  }, [companyId]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</div>
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Star
              key={rating}
              className={`h-5 w-5 ${
                rating <= Math.round(stats.averageRating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Based on {stats.totalReviews} reviews
        </p>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2">
            <div className="w-8">{rating}</div>
            <Progress
              value={
                (stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] || 0) / stats.totalReviews * 100
              }
              className="h-2"
            />
            <div className="w-12 text-sm text-muted-foreground">
              {stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] || 0}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-semibold">Category Ratings</h4>
        <div className="space-y-2">
          {Object.entries(stats.categoryAverages).map(([category, rating]) => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                <span>{Number(rating).toFixed(1)}</span>
              </div>
              <Progress
                value={Number(rating) / 5 * 100}
                className="h-1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
