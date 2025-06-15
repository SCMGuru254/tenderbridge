import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeaturedClients } from '@/hooks/useFeaturedClients';

export const FeaturedClientForm = () => {
  const { submitFeaturedClientApplication, loading } = useFeaturedClients();
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_website: '',
    contact_person: '',
    phone_number: '',
    intent_type: '' as 'featured_listing' | 'sponsor' | 'advertisement' | 'premium_placement' | '',
    budget_range: '',
    subscription_type: 'monthly' as 'monthly' | 'yearly'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.intent_type) return;
    await submitFeaturedClientApplication(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for Featured Client Services</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="company_email">Company Email</Label>
            <Input
              id="company_email"
              type="email"
              value={formData.company_email}
              onChange={(e) => setFormData({...formData, company_email: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="intent_type">Service Type</Label>
            <Select
              value={formData.intent_type}
              onValueChange={(value) => setFormData({...formData, intent_type: value as 'featured_listing' | 'sponsor' | 'advertisement' | 'premium_placement'})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured_listing">Featured Listing</SelectItem>
                <SelectItem value="sponsor">Homepage Sponsorship</SelectItem>
                <SelectItem value="advertisement">Advertisement</SelectItem>
                <SelectItem value="premium_placement">Premium Placement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget_range">Budget Range</Label>
            <Select onValueChange={(value) => setFormData({...formData, budget_range: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$20-50/month">$20-50/month</SelectItem>
                <SelectItem value="$100-500/month">$100-500/month</SelectItem>
                <SelectItem value="$500-1000/month">$500-1000/month</SelectItem>
                <SelectItem value="$1000+/month">$1000+/month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
