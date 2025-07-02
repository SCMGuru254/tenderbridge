
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MapPin, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SalarySubmission {
  job_title: string;
  company_name: string;
  location: string;
  experience_years: number;
  salary_amount: number;
  currency: string;
  employment_type: string;
  benefits: string[];
  additional_info?: string;
}

export const SalarySubmissionForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SalarySubmission>({
    job_title: '',
    company_name: '',
    location: '',
    experience_years: 0,
    salary_amount: 0,
    currency: 'USD',
    employment_type: 'full-time',
    benefits: [],
    additional_info: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to submit salary data');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('salary_submissions')
        .insert({
          ...submission,
          user_id: user.id
        });

      if (error) throw error;

      toast.success('Salary data submitted successfully!');
      setSubmission({
        job_title: '',
        company_name: '',
        location: '',
        experience_years: 0,
        salary_amount: 0,
        currency: 'USD',
        employment_type: 'full-time',
        benefits: [],
        additional_info: ''
      });
    } catch (error) {
      console.error('Error submitting salary data:', error);
      toast.error('Failed to submit salary data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBenefitToggle = (benefit: string) => {
    setSubmission(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const commonBenefits = [
    'Health Insurance', 'Dental Coverage', 'Vision Coverage',
    'Retirement Plan', 'Paid Time Off', 'Remote Work',
    'Flexible Hours', 'Professional Development', 'Stock Options'
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Submit Salary Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={submission.job_title}
                onChange={(e) => setSubmission(prev => ({ ...prev, job_title: e.target.value }))}
                placeholder="Supply Chain Manager"
                required
              />
            </div>
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={submission.company_name}
                onChange={(e) => setSubmission(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Company Inc."
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={submission.location}
                onChange={(e) => setSubmission(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Nairobi, Kenya"
                required
              />
            </div>
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                value={submission.experience_years}
                onChange={(e) => setSubmission(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="employment_type">Employment Type</Label>
              <Select
                value={submission.employment_type}
                onValueChange={(value) => setSubmission(prev => ({ ...prev, employment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary_amount">Annual Salary</Label>
              <Input
                id="salary_amount"
                type="number"
                min="0"
                value={submission.salary_amount}
                onChange={(e) => setSubmission(prev => ({ ...prev, salary_amount: parseFloat(e.target.value) || 0 }))}
                placeholder="50000"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={submission.currency}
                onValueChange={(value) => setSubmission(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Benefits & Perks</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {commonBenefits.map((benefit) => (
                <Badge
                  key={benefit}
                  variant={submission.benefits.includes(benefit) ? "default" : "outline"}
                  className="cursor-pointer justify-center p-2"
                  onClick={() => handleBenefitToggle(benefit)}
                >
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="additional_info">Additional Information (Optional)</Label>
            <Textarea
              id="additional_info"
              value={submission.additional_info}
              onChange={(e) => setSubmission(prev => ({ ...prev, additional_info: e.target.value }))}
              placeholder="Any additional details about compensation, work environment, etc."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Salary Data'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
