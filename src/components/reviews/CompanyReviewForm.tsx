import React, { useState } from 'react';
import { AnonymousContent } from '@/components/common/AnonymousContent';
import { supabase } from '@/integrations/supabase/client';
import type { CompanyReview, ReviewFormData } from '@/types/review';
import { Rating } from '@/components/ui/rating';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';

interface CompanyReviewFormProps {
  companyId: string;
  onSuccess?: () => void;
}

export const CompanyReviewForm: React.FC<CompanyReviewFormProps> = ({ 
  companyId,
  onSuccess 
}) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    workLife: 0,
    management: 0,
    culture: 0,
    compensation: 0,
    career: 0,
    jobSecurity: 0
  });
  const [position, setPosition] = useState('');
  const [duration, setDuration] = useState('');
  const { addToast } = useToast();

  const handleReviewSubmit = async (review_text: string, anonymous: boolean) => {
    const formData: ReviewFormData = {
      title: `${position} Review`,
      review_text,
      rating: ratings.overall,
      work_life_balance: ratings.workLife,
      management: ratings.management,
      culture: ratings.culture,
      salary_benefits: ratings.compensation,
      career_growth: ratings.career,
      job_security: ratings.jobSecurity,
      position,
      employment_status: 'current', // Could be made configurable
      employment_period: duration,
      anonymous
    };
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate ratings
      const ratingFields = ['rating', 'work_life_balance', 'salary_benefits', 'job_security', 'management', 'culture', 'career_growth'] as const;
      for (const field of ratingFields) {
        const value = formData[field];
        if (typeof value !== 'number' || value < 1 || value > 5) {
          throw new Error(`${field} must be between 1 and 5`);
        }
      }

      // Validate required fields
      if (!formData.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.review_text?.trim()) {
        throw new Error('Review text is required');
      }

      // Validate employment status
      if (!['current', 'former', 'interview'].includes(formData.employment_status)) {
        throw new Error('Invalid employment status');
      }

      const reviewData: CompanyReview = {
        company_id: companyId,
        reviewer_id: user.id,
        title: formData.title.trim(),
        review_text: formData.review_text.trim(),
        rating: formData.rating,
        work_life_balance: formData.work_life_balance,
        management: formData.management,
        culture: formData.culture,
        salary_benefits: formData.salary_benefits,
        career_growth: formData.career_growth,
        job_security: formData.job_security,
        position: formData.position?.trim(),
        employment_status: formData.employment_status,
        employment_period: formData.employment_period?.trim(),
        location: formData.location?.trim(),
        pros: formData.pros?.trim(),
        cons: formData.cons?.trim(),
        anonymous: formData.anonymous,
        review_status: 'pending',
        helpful_votes: 0,
        reported_count: 0,
        verified: false
      };

      const { error } = await supabase
        .from('company_reviews')
        .insert([reviewData])
        .select('id')
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          addToast({
            title: "Duplicate Review",
            description: "You have already submitted a review for this company",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      addToast({
        title: "Review submitted",
        description: "Your review is pending approval",
        variant: "success"
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      addToast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const AdditionalFields = () => (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Work-Life Balance</label>
          <Rating 
            value={ratings.workLife} 
            onChange={(val: number) => setRatings(r => ({ ...r, workLife: val }))} 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Management</label>
          <Rating 
            value={ratings.management} 
            onChange={(val: number) => setRatings(r => ({ ...r, management: val }))} 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Company Culture</label>
          <Rating 
            value={ratings.culture} 
            onChange={(val: number) => setRatings(r => ({ ...r, culture: val }))} 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Compensation</label>
          <Rating 
            value={ratings.compensation} 
            onChange={(val: number) => setRatings(r => ({ ...r, compensation: val }))} 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Job Security</label>
          <Rating 
            value={ratings.jobSecurity} 
            onChange={(val: number) => setRatings(r => ({ ...r, jobSecurity: val }))} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Your Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <Input
          placeholder="Employment Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Overall Rating</label>
        <Rating 
          value={ratings.overall} 
          onChange={(val: number) => setRatings(r => ({ ...r, overall: val }))} 
          size="lg"
        />
      </div>
    </div>
  );

  return (
    <AnonymousContent
      onSubmit={handleReviewSubmit}
      placeholder="Share your experience with this company..."
      title="Write a Company Review"
      buttonText="Submit Review"
      maxLength={5000}
      minLength={50}
      additionalFields={<AdditionalFields />}
      showDialog
    />
  );
};