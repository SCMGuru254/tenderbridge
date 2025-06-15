
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useFeaturedClients } from '@/hooks/useFeaturedClients';
import type { FeaturedClient } from '@/types/affiliate';

export const FeaturedClientForm = () => {
  const { submitFeaturedClientApplication, pricingPlans, loading } = useFeaturedClients();
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_website: '',
    contact_person: '',
    phone_number: '',
    intent_type: 'featured_listing' as FeaturedClient['intent_type'],
    budget_range: '',
    subscription_type: 'monthly' as 'monthly' | 'yearly',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeaturedClientApplication(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRelevantPricing = () => {
    return pricingPlans.filter(plan => 
      plan.plan_type === 'featured_client' || 
      plan.plan_type === 'advertisement' || 
      plan.plan_type === 'sponsor'
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Featured Client Application</CardTitle>
        <CardDescription>
          Apply for premium placement and advertising opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="company_email">Company Email *</Label>
                <Input
                  id="company_email"
                  type="email"
                  value={formData.company_email}
                  onChange={(e) => handleInputChange('company_email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company_website">Company Website</Label>
              <Input
                id="company_website"
                type="url"
                value={formData.company_website}
                onChange={(e) => handleInputChange('company_website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person">Contact Person *</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Intent Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Type</h3>
            <RadioGroup
              value={formData.intent_type}
              onValueChange={(value) => handleInputChange('intent_type', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="featured_listing" id="featured_listing" />
                <Label htmlFor="featured_listing">Featured Listing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sponsor" id="sponsor" />
                <Label htmlFor="sponsor">Homepage Sponsorship</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advertisement" id="advertisement" />
                <Label htmlFor="advertisement">Advertisement Placement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium_placement" id="premium_placement" />
                <Label htmlFor="premium_placement">Premium Placement</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Budget Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Budget & Billing</h3>
            
            <div>
              <Label htmlFor="budget_range">Budget Range *</Label>
              <Select onValueChange={(value) => handleInputChange('budget_range', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-500">Under $500/month</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000/month</SelectItem>
                  <SelectItem value="1000-2500">$1,000 - $2,500/month</SelectItem>
                  <SelectItem value="2500-5000">$2,500 - $5,000/month</SelectItem>
                  <SelectItem value="over-5000">Over $5,000/month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferred Billing Cycle</Label>
              <RadioGroup
                value={formData.subscription_type}
                onValueChange={(value) => handleInputChange('subscription_type', value as 'monthly' | 'yearly')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yearly" id="yearly" />
                  <Label htmlFor="yearly">Yearly (Save 17%)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getRelevantPricing().map((plan) => (
                <div key={plan.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{plan.plan_name}</h4>
                  <p className="text-2xl font-bold">${plan.price_amount}</p>
                  <p className="text-sm text-muted-foreground">
                    {plan.billing_cycle === 'per_use' ? 'per use' : `per ${plan.billing_cycle}`}
                  </p>
                  <div className="mt-2">
                    {Object.entries(plan.features).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="mr-1 mb-1">
                        {String(value)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
