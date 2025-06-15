
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/components/ui/use-toast';
import type { AffiliateProgram, AffiliateReferral, AffiliatePayout } from '@/types/affiliate';

export const useAffiliate = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [affiliateProgram, setAffiliateProgram] = useState<AffiliateProgram | null>(null);
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);

  const generateAffiliateCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const createAffiliateProgram = async () => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const affiliateCode = generateAffiliateCode();
      const referralLink = `${window.location.origin}/?ref=${affiliateCode}`;
      
      const { data, error } = await supabase
        .from('affiliate_programs')
        .insert({
          user_id: user.id,
          affiliate_code: affiliateCode,
          referral_link: referralLink,
        })
        .select()
        .single();

      if (error) throw error;

      setAffiliateProgram(data);
      toast({
        title: "Affiliate program created!",
        description: "You can now start earning commissions by referring new clients.",
      });

      return data;
    } catch (error) {
      console.error('Error creating affiliate program:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create affiliate program.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliateProgram = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('affiliate_programs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setAffiliateProgram(data || null);
    } catch (error) {
      console.error('Error fetching affiliate program:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrals = async () => {
    if (!affiliateProgram) return;
    
    try {
      const { data, error } = await supabase
        .from('affiliate_referrals')
        .select('*')
        .eq('affiliate_id', affiliateProgram.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const fetchPayouts = async () => {
    if (!affiliateProgram) return;
    
    try {
      const { data, error } = await supabase
        .from('affiliate_payouts')
        .select('*')
        .eq('affiliate_id', affiliateProgram.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setPayouts(data || []);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  const requestPayout = async (amount: number, payoutDetails: any) => {
    if (!affiliateProgram) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('affiliate_payouts')
        .insert({
          affiliate_id: affiliateProgram.id,
          amount,
          payout_details: payoutDetails,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Payout requested",
        description: "Your payout request has been submitted for processing.",
      });

      fetchPayouts();
      return data;
    } catch (error) {
      console.error('Error requesting payout:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to request payout.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAffiliateProgram();
    }
  }, [user]);

  useEffect(() => {
    if (affiliateProgram) {
      fetchReferrals();
      fetchPayouts();
    }
  }, [affiliateProgram]);

  return {
    loading,
    affiliateProgram,
    referrals,
    payouts,
    createAffiliateProgram,
    requestPayout,
    fetchAffiliateProgram,
  };
};
