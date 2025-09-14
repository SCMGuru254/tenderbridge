import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CompanySignupFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CompanySignupForm({ onSuccess, onCancel }: CompanySignupFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    website: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to add a company');
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }
    
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('companies')
        .insert([{
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          location: formData.location.trim() || null,
          website: formData.website.trim() || null,
          user_id: user.id,
          verification_status: 'pending'
        }]);

      if (error) {
        console.error('Error adding company:', error);
        toast.error('Failed to add company. Please try again.');
        return;
      }

      toast.success('Company added successfully! It will be reviewed and verified.');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        location: '',
        website: ''
      });
      setAcceptedTerms(false);
      
      onSuccess?.();
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('Failed to add company. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add a Company</CardTitle>
        <p className="text-sm text-muted-foreground">
          Help build our company directory by adding your company or one you know about.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-description">Description</Label>
            <Textarea
              id="company-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what the company does"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-location">Location</Label>
            <Input
              id="company-location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Nairobi, Kenya"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-website">Website</Label>
            <Input
              id="company-website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://company.com"
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Important Notice</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All company submissions are reviewed before being published</li>
              <li>• Only add companies you have legitimate knowledge of</li>
              <li>• False or misleading information may result in account suspension</li>
              <li>• By submitting, you confirm the information is accurate to your knowledge</li>
            </ul>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="accept-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <Label htmlFor="accept-terms" className="text-sm leading-relaxed">
              I confirm that the information provided is accurate and I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>{' '}
              and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Adding Company...' : 'Add Company'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
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