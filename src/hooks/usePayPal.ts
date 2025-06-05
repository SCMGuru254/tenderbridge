
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/useUser';

export const usePayPal = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const createSubscriptionPlan = async (planData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-integration', {
        body: { 
          action: 'create-plan', 
          data: { planData, userId: user?.id } 
        }
      });

      if (error) throw error;

      toast({
        title: "Subscription plan created",
        description: "Your subscription plan has been created successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create subscription plan.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (subscriptionData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-integration', {
        body: { 
          action: 'create-subscription', 
          data: { subscriptionData, userId: user?.id } 
        }
      });

      if (error) throw error;

      toast({
        title: "Subscription created",
        description: "Your subscription has been created successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create subscription.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (orderData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-integration', {
        body: { 
          action: 'create-payment', 
          data: { orderData, userId: user?.id } 
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create payment.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const capturePayment = async (orderId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-integration', {
        body: { 
          action: 'capture-payment', 
          data: { orderId } 
        }
      });

      if (error) throw error;

      toast({
        title: "Payment captured",
        description: "Your payment has been processed successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error capturing payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPayout = async (payoutData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-integration', {
        body: { 
          action: 'create-payout', 
          data: { payoutData, userId: user?.id } 
        }
      });

      if (error) throw error;

      toast({
        title: "Payout created",
        description: "Your payout has been initiated successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating payout:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create payout.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string, reason: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-integration', {
        body: { 
          action: 'cancel-subscription', 
          data: { subscriptionId, reason } 
        }
      });

      if (error) throw error;

      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel subscription.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-integration', {
        body: { 
          action: 'get-dashboard', 
          data: { userId: user?.id } 
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch dashboard data.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createSubscriptionPlan,
    createSubscription,
    createPayment,
    capturePayment,
    createPayout,
    cancelSubscription,
    getDashboardData,
  };
};
