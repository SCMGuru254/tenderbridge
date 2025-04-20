
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, StarHalf, User } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompanyReviewForm } from "./CompanyReviewForm";

// Define the interface for company reviews
interface CompanyReview {
  id: string;
  company_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  pros?: string | null;
  cons?: string | null;
  work_life_balance: number;
  salary_benefits: number;
  career_growth: number;
  management: number;
  culture: number;
  is_current_employee: boolean;
  job_title?: string | null;
  created_at: string;
  is_anonymous: boolean;
}

interface CompanyReviewsProps {
  companyId: string;
}

export function CompanyReviews({ companyId }: CompanyReviewsProps) {
  const { data: reviews, refetch } = useQuery({
    queryKey: ['company-reviews', companyId],
    queryFn: async () => {
      // Cast the table name as any to bypass type checking
      // This is needed until the types are updated to include the new table
      const { data, error } = await supabase
        .from('company_reviews' as any)
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Explicitly cast the data to the CompanyReview[] type to fix the TypeScript error
      return (data as unknown) as CompanyReview[];
    },
  });

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-2 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Reviews</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <CompanyReviewForm companyId={companyId} onSuccess={() => refetch()} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {reviews?.map((review) => (
          <div key={review.id} className="border rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {review.is_anonymous ? "Anonymous" : review.job_title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {review.is_current_employee ? "Current Employee" : "Former Employee"} •{" "}
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
              {renderRating(review.rating)}
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">{review.review_text}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {review.pros && (
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Pros</h4>
                    <p className="text-sm">{review.pros}</p>
                  </div>
                )}
                {review.cons && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Cons</h4>
                    <p className="text-sm">{review.cons}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Work/Life Balance</p>
                  {renderRating(review.work_life_balance)}
                </div>
                <div>
                  <p className="text-gray-500">Salary & Benefits</p>
                  {renderRating(review.salary_benefits)}
                </div>
                <div>
                  <p className="text-gray-500">Career Growth</p>
                  {renderRating(review.career_growth)}
                </div>
                <div>
                  <p className="text-gray-500">Management</p>
                  {renderRating(review.management)}
                </div>
                <div>
                  <p className="text-gray-500">Company Culture</p>
                  {renderRating(review.culture)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!reviews || reviews.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews yet. Be the first to write a review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
