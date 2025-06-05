
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePayPal } from "@/hooks/usePayPal";
import { Users, Calendar, DollarSign, Plus } from "lucide-react";

export const PayPalSubscriptions = () => {
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [interval, setInterval] = useState('MONTH');
  const [intervalCount, setIntervalCount] = useState('1');
  const { createSubscriptionPlan, createSubscription, loading } = usePayPal();

  const handleCreatePlan = async () => {
    if (!planName || !planDescription || !price) {
      return;
    }

    const planData = {
      product_id: crypto.randomUUID(),
      name: planName,
      description: planDescription,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: interval,
            interval_count: parseInt(intervalCount),
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // 0 means infinite
          pricing_scheme: {
            fixed_price: {
              value: price,
              currency_code: currency,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
      taxes: {
        percentage: '0',
        inclusive: false,
      },
    };

    const result = await createSubscriptionPlan(planData);
    
    if (result?.success) {
      // Reset form
      setPlanName('');
      setPlanDescription('');
      setPrice('');
      setCurrency('USD');
      setInterval('MONTH');
      setIntervalCount('1');
    }
  };

  const predefinedPlans = [
    {
      name: 'Basic Plan',
      description: 'Access to basic features',
      price: '9.99',
      interval: 'MONTH',
    },
    {
      name: 'Pro Plan',
      description: 'Access to all features',
      price: '19.99',
      interval: 'MONTH',
    },
    {
      name: 'Enterprise Plan',
      description: 'Custom enterprise solution',
      price: '99.99',
      interval: 'MONTH',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Create New Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Subscription Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                placeholder="e.g., Premium Plan"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planDescription">Description</Label>
            <Textarea
              id="planDescription"
              placeholder="Describe what this plan includes..."
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Billing Interval</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Daily</SelectItem>
                  <SelectItem value="WEEK">Weekly</SelectItem>
                  <SelectItem value="MONTH">Monthly</SelectItem>
                  <SelectItem value="YEAR">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intervalCount">Interval Count</Label>
              <Input
                id="intervalCount"
                type="number"
                value={intervalCount}
                onChange={(e) => setIntervalCount(e.target.value)}
                min="1"
                max="12"
              />
            </div>
          </div>

          <Button 
            onClick={handleCreatePlan} 
            disabled={loading || !planName || !planDescription || !price}
            className="w-full"
          >
            {loading ? 'Creating Plan...' : 'Create Subscription Plan'}
          </Button>
        </CardContent>
      </Card>

      {/* Predefined Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Start Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {predefinedPlans.map((plan, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  <Badge variant="outline">Popular</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-lg text-muted-foreground">/{plan.interval.toLowerCase()}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  {plan.description}
                </p>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Unlimited users
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Monthly billing
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setPlanName(plan.name);
                    setPlanDescription(plan.description);
                    setPrice(plan.price);
                    setInterval(plan.interval);
                  }}
                >
                  Use This Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
