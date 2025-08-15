import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewForm } from "./ReviewForm.tsx";
import { ReviewList } from "./ReviewList.tsx";
import { ReviewStats } from "./ReviewStats.tsx";

export const CompanyReviews = () => {
  const { companyId } = useParams();
  const { user } = useAuth();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviews] = useState<any[]>([]);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch reviews for the company
  // const fetchReviews = async () => {
  //   setLoading(true);
  //   // TODO: Replace with actual fetch logic
  //   setLoading(false);
  // };

  // Handlers for voting/reporting
  const handleVote = async () => {
    // TODO: Implement vote logic
  };

  // Handler for submitting a review
  const handleSubmitReview = async () => {
    // TODO: Implement submit logic
    setIsAddingReview(false);
    // fetchReviews();
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
              totalPages={1}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
