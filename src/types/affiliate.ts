
export interface AffiliateProgram {
  id: string;
  user_id: string;
  affiliate_code: string;
  referral_link: string;
  commission_rate: number;
  total_earnings: number;
  pending_payouts: number;
  total_paid_out: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  referred_user_id?: string;
  referral_type: 'client' | 'featured_provider' | 'advertiser';
  conversion_amount?: number;
  commission_earned?: number;
  status: 'pending' | 'converted' | 'paid';
  converted_at?: string;
  paid_at?: string;
  created_at: string;
}

export interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  amount: number;
  payout_method: string;
  payout_details?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requested_at: string;
  processed_at?: string;
  notes?: string;
}

export interface FeaturedClient {
  id: string;
  user_id: string;
  company_name: string;
  company_email: string;
  company_website?: string;
  contact_person: string;
  phone_number?: string;
  intent_type: 'featured_listing' | 'sponsor' | 'advertisement' | 'premium_placement';
  budget_range: string;
  subscription_type?: 'monthly' | 'yearly';
  monthly_fee?: number;
  yearly_fee?: number;
  ad_views_purchased?: number;
  ad_views_used?: number;
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'cancelled';
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewResponse {
  id: string;
  provider_id: string;
  review_id: string;
  response_text: string;
  payment_type: 'per_response' | 'subscription';
  amount_paid: number;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_date?: string;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  plan_type: string;
  plan_name: string;
  price_amount: number;
  billing_cycle?: 'monthly' | 'yearly' | 'weekly' | 'per_use';
  features: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
