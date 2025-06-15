
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePayPal } from "@/hooks/usePayPal";

interface SubscriptionPlan {
  id: string;
  plan_id: string;
  name: string;
  description: string;
  status: string;
  plan_data: any;
  created_at: string;
}

interface Subscription {
  id: string;
  subscription_id: string;
  plan_id: string;
  status: string;
  subscription_data: any;
  created_at: string;
}

export const PayPalSubscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    interval: "MONTH"
  });
  const { createSubscriptionPlan, loading: paypalLoading } = usePayPal();

  useEffect(() => {
    fetchPlans();
    fetchSubscriptions();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await supabase
        .from('paypal_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data } = await supabase
        .from('paypal_subscriptions')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });
      
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.price) {
      toast.error("Please fill in plan name and price");
      return;
    }

    const planData = {
      product_id: crypto.randomUUID(),
      name: newPlan.name,
      description: newPlan.description,
      billing_cycles: [
        {
          frequency: {
            interval_unit: newPlan.interval,
            interval_count: 1
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: newPlan.price,
              currency_code: newPlan.currency
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
      setNewPlan({ name: "", description: "", price: "", currency: "USD", interval: "MONTH" });
      fetchPlans();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    if (currency === 'KSH') {
      return `KSH ${amount}`;
    }
    return `$${amount}`;
  };

  return (
    <div className="space-y-6">
      {/* Create New Plan Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                placeholder="Premium Plan"
                value={newPlan.name}
                onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Access to premium features"
                value={newPlan.description}
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="9.99"
                value={newPlan.price}
                onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newPlan.currency}
                onChange={(e) => setNewPlan({...newPlan, currency: e.target.value})}
              >
                <option value="USD">USD ($)</option>
                <option value="KSH">KSH (Kenyan Shilling)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="interval">Billing Interval</Label>
              <select
                id="interval"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newPlan.interval}
                onChange={(e) => setNewPlan({...newPlan, interval: e.target.value})}
              >
                <option value="MONTH">Monthly</option>
                <option value="YEAR">Yearly</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={handleCreatePlan}
            disabled={paypalLoading || !newPlan.name || !newPlan.price}
            className="w-full md:w-auto"
          >
            {paypalLoading ? "Creating Plan..." : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : plans.length > 0 ? (
            <div className="space-y-4">
              {plans.map((plan) => {
                const price = plan.plan_data?.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.value || '0.00';
                const currency = plan.plan_data?.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.currency_code || 'USD';
                
                return (
                  <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(plan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(price, currency)}
                      </p>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No plans created yet. Create your first plan above.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Active Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Subscription: {subscription.subscription_id.slice(-8)}</p>
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
