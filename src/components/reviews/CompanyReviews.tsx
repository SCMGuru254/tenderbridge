import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import { ReviewStats } from './ReviewStats';
import { reviewCategories } from '@/config/reviews';

export const CompanyReviews = () => {
  const { companyId } = useParams();
  const { user } = useAuth();
  const [isAddingReview, setIsAddingReview] = useState(false);

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
              <ReviewStats companyId={companyId} />
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          {isAddingReview ? (
            <Card>
              <CardContent className="p-6">
                <ReviewForm 
                  companyId={companyId} 
                  onCancel={() => setIsAddingReview(false)}
                  onSuccess={() => setIsAddingReview(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <ReviewList companyId={companyId} />
          )}
        </div>
      </div>
    </div>
  );
};
