import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
<parameter name="content">import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CompanyReviewFormProps {
  companyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CompanyReviewForm({ companyId, onSuccess, onCancel }: CompanyReviewFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review_text: '',
    pros: '',
    cons: '',
    job_position: '',
    work_life_balance_rating: 0,
    compensation_rating: 0,
    culture_rating: 0,
    management_rating: 0,
    career_growth_rating: 0,
    is_current_employee: true,
    is_anonymous: false,
    employment_duration: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to submit a review');
      return;
    }
    
    if (formData.rating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }
    
    if (!formData.review_text.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('company_reviews')
        .insert({
          company_id: companyId,
          user_id: user.id,
          reviewer_id: user.id,
          ...formData,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success('Review submitted successfully! It will be published after moderation.');
      onSuccess?.();
      
      // Reset form
      setFormData({
        rating: 0,
        review_text: '',
        pros: '',
        cons: '',
        job_position: '',
        work_life_balance_rating: 0,
        compensation_rating: 0,
        culture_rating: 0,
        management_rating: 0,
        career_growth_rating: 0,
        is_current_employee: true,
        is_anonymous: false,
        employment_duration: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onChange, label }: { rating: number; onChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 ? `${rating}/5` : 'No rating'}
        </span>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Write a Company Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <StarRating
            label="Overall Rating *"
            rating={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
          />

          {/* Job Position */}
          <div className="space-y-2">
            <Label htmlFor="job_position">Job Title</Label>
            <Input
              id="job_position"
              value={formData.job_position}
              onChange={(e) => setFormData({ ...formData, job_position: e.target.value })}
              placeholder="e.g. Supply Chain Manager"
            />
          </div>

          {/* Employment Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_current_employee"
              checked={formData.is_current_employee}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_current_employee: checked as boolean })
              }
            />
            <Label htmlFor="is_current_employee">I currently work here</Label>
          </div>

          {/* Employment Duration */}
          <div className="space-y-2">
            <Label htmlFor="employment_duration">Employment Duration</Label>
            <Select 
              value={formData.employment_duration} 
              onValueChange={(value) => setFormData({ ...formData, employment_duration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less-than-1-year">Less than 1 year</SelectItem>
                <SelectItem value="1-2-years">1-2 years</SelectItem>
                <SelectItem value="3-5-years">3-5 years</SelectItem>
                <SelectItem value="5-10-years">5-10 years</SelectItem>
                <SelectItem value="more-than-10-years">More than 10 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review_text">Your Review *</Label>
            <Textarea
              id="review_text"
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              placeholder="Share your experience working at this company..."
              rows={4}
              required
            />
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label htmlFor="pros">What you liked (Pros)</Label>
            <Textarea
              id="pros"
              value={formData.pros}
              onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
              placeholder="What did you enjoy about working here?"
              rows={3}
            />
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label htmlFor="cons">Areas for improvement (Cons)</Label>
            <Textarea
              id="cons"
              value={formData.cons}
              onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
              placeholder="What could be improved?"
              rows={3}
            />
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StarRating
              label="Work-Life Balance"
              rating={formData.work_life_balance_rating}
              onChange={(rating) => setFormData({ ...formData, work_life_balance_rating: rating })}
            />
            <StarRating
              label="Compensation & Benefits"
              rating={formData.compensation_rating}
              onChange={(rating) => setFormData({ ...formData, compensation_rating: rating })}
            />
            <StarRating
              label="Company Culture"
              rating={formData.culture_rating}
              onChange={(rating) => setFormData({ ...formData, culture_rating: rating })}
            />
            <StarRating
              label="Management"
              rating={formData.management_rating}
              onChange={(rating) => setFormData({ ...formData, management_rating: rating })}
            />
            <StarRating
              label="Career Growth"
              rating={formData.career_growth_rating}
              onChange={(rating) => setFormData({ ...formData, career_growth_rating: rating })}
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_anonymous: checked as boolean })
              }
            />
            <Label htmlFor="is_anonymous">Post anonymously</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}