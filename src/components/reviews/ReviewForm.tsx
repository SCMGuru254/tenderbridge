import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const reviewSchema = z.object({
  title: z.string().min(10).max(100),
  review_text: z.string().min(50).max(2000),
  rating: z.number().min(1).max(5),
  pros: z.string().max(1000).optional(),
  cons: z.string().max(1000).optional(),
  position: z.string().min(3).max(100),
  employment_status: z.enum(['current', 'former', 'interview']),
  employment_period: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  work_life_balance: z.number().min(1).max(5),
  salary_benefits: z.number().min(1).max(5),
  job_security: z.number().min(1).max(5),
  management: z.number().min(1).max(5),
  culture: z.number().min(1).max(5),
  career_growth: z.number().min(1).max(5),
  anonymous: z.boolean().default(true),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  companyId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ReviewForm = ({ companyId, onCancel, onSuccess }: ReviewFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      anonymous: true,
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('company_reviews')
        .insert({
          ...data,
          company_id: companyId,
          reviewer_id: user.id,
        });

      if (error) throw error;

      toast.success('Review submitted successfully');
      onSuccess();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input placeholder="Summarize your experience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add all other form fields */}
        {/* Rating */}
        {/* Position */}
        {/* Employment Status */}
        {/* Review Text */}
        {/* Pros & Cons */}
        {/* Category Ratings */}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
