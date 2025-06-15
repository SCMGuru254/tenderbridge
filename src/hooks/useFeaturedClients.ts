
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/components/ui/use-toast';
import type { FeaturedClient, PricingPlan } from '@/types/affiliate';

export const useFeaturedClients = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [featuredClients, setFeaturedClients] = useState<FeaturedClient[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);

  const fetchPricingPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_amount');

      if (error) throw error;
      setPricingPlans(data || []);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
    }
  };

  const submitFeaturedClientApplication = async (applicationData: Partial<FeaturedClient>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('featured_clients')
        .insert({
          ...applicationData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your featured client application has been submitted for review.",
      });

      fetchFeaturedClients();
      return data;
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit application.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedClients = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('featured_clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeaturedClients(data || []);
    } catch (error) {
      console.error('Error fetching featured clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
    if (user) {
      fetchFeaturedClients();
    }
  }, [user]);

  return {
    loading,
    featuredClients,
    pricingPlans,
    submitFeaturedClientApplication,
    fetchFeaturedClients,
  };
};
