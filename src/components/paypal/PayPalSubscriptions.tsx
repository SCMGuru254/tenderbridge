import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { usePayPal } from "@/hooks/usePayPal";
import { toast } from "sonner";

interface Subscription {
  id: string;
  subscription_id: string;
  plan_id: string;
  status: string;
  subscription_data: any;
  created_at: string;
}

interface SubscriptionPlan {
  id: string;
  plan_id: string;
  name: string;
  description: string;
  status: string;
  plan_data: any;
}

export const PayPalSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: "",
    interval: "monthly"
  });
  const { createSubscriptionPlan, createSubscription, loading: paypalLoading } = usePayPal();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subscriptionsResult, plansResult] = await Promise.all([
        supabase.from('paypal_subscriptions').select('*').order('created_at', { ascending: false }),
        supabase.from('paypal_plans').select('*').order('created_at', { ascending: false })
      ]);

      setSubscriptions(subscriptionsResult.data || []);
      setPlans(plansResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const planData = {
      product_id: crypto.randomUUID(),
      name: newPlan.name,
      description: newPlan.description,
      type: "SERVICE",
      category: "SOFTWARE",
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: newPlan.interval.toUpperCase(),
            interval_count: 1
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: newPlan.price,
              currency_code: "USD"
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3
      }
    };

    const result = await createSubscriptionPlan(planData);
    if (result) {
      toast.success("Subscription plan created successfully!");
      setNewPlan({ name: "", description: "", price: "", interval: "monthly" });
      fetchData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Create Subscription Plan</CardTitle>
          <CardDescription>Set up recurring payment plans for your services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                placeholder="Premium Plan"
                value={newPlan.name}
                onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="plan-price">Price (USD)</Label>
              <Input
                id="plan-price"
                type="number"
                placeholder="29.99"
                value={newPlan.price}
                onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="plan-interval">Billing Interval</Label>
              <Select value={newPlan.interval} onValueChange={(value) => setNewPlan({...newPlan, interval: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="plan-description">Description</Label>
              <Input
                id="plan-description"
                placeholder="Premium features and support"
                value={newPlan.description}
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
              />
            </div>
          </div>
          <Button 
            onClick={handleCreatePlan}
            disabled={paypalLoading || !newPlan.name || !newPlan.price}
            className="w-full md:w-auto"
          >
            {paypalLoading ? "Creating..." : "Create Plan"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Your available subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length > 0 ? (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(plan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No subscription plans created yet. Create your first plan above.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Active Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>Current subscriber activity</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Subscription {subscription.subscription_id.slice(-8)}</h3>
                    <p className="text-sm text-muted-foreground">Plan: {subscription.plan_id}</p>
                    <p className="text-xs text-muted-foreground">
                      Started: {new Date(subscription.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No active subscriptions yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
