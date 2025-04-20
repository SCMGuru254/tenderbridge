
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CompanyReviewFormProps {
  companyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CompanyReviewForm({ companyId, onSuccess, onCancel }: CompanyReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: "",
    review_text: "",
    pros: "",
    cons: "",
    work_life_balance: "",
    salary_benefits: "",
    career_growth: "",
    management: "",
    culture: "",
    is_current_employee: false,
    job_title: "",
    is_anonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('company_reviews').insert({
        company_id: companyId,
        rating: parseInt(formData.rating),
        review_text: formData.review_text,
        pros: formData.pros || null,
        cons: formData.cons || null,
        work_life_balance: parseInt(formData.work_life_balance),
        salary_benefits: parseInt(formData.salary_benefits),
        career_growth: parseInt(formData.career_growth),
        management: parseInt(formData.management),
        culture: parseInt(formData.culture),
        is_current_employee: formData.is_current_employee,
        job_title: formData.job_title || null,
        is_anonymous: formData.is_anonymous,
      });

      if (error) throw error;

      toast.success("Review submitted successfully!");
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to submit review: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="rating">Overall Rating</Label>
          <Select
            value={formData.rating}
            onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} {rating === 1 ? "Star" : "Stars"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="review_text">Review</Label>
          <Textarea
            id="review_text"
            value={formData.review_text}
            onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
            placeholder="Share your experience working at this company..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pros">Pros</Label>
            <Textarea
              id="pros"
              value={formData.pros}
              onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
              placeholder="What did you like about working here?"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="cons">Cons</Label>
            <Textarea
              id="cons"
              value={formData.cons}
              onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
              placeholder="What didn't you like about working here?"
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'work_life_balance', label: 'Work/Life Balance' },
            { key: 'salary_benefits', label: 'Salary & Benefits' },
            { key: 'career_growth', label: 'Career Growth' },
            { key: 'management', label: 'Management' },
            { key: 'culture', label: 'Company Culture' },
          ].map(({ key, label }) => (
            <div key={key}>
              <Label htmlFor={key}>{label}</Label>
              <Select
                value={formData[key as keyof typeof formData] as string}
                onValueChange={(value) => setFormData(prev => ({ ...prev, [key]: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="job_title">Job Title</Label>
          <Input
            id="job_title"
            value={formData.job_title}
            onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
            placeholder="Your job title"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_current_employee}
              onChange={(e) => setFormData(prev => ({ ...prev, is_current_employee: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span>I am currently working here</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_anonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, is_anonymous: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span>Post anonymously</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
