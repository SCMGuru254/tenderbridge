
-- Create affiliate programs table
CREATE TABLE public.affiliate_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  affiliate_code TEXT UNIQUE NOT NULL,
  referral_link TEXT NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  pending_payouts DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_paid_out DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate referrals tracking table
CREATE TABLE public.affiliate_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.affiliate_programs(id) NOT NULL,
  referred_user_id UUID REFERENCES auth.users,
  referral_type TEXT NOT NULL CHECK (referral_type IN ('client', 'featured_provider', 'advertiser')),
  conversion_amount DECIMAL(10,2),
  commission_earned DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'paid')),
  converted_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create featured clients table
CREATE TABLE public.featured_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_website TEXT,
  contact_person TEXT NOT NULL,
  phone_number TEXT,
  intent_type TEXT NOT NULL CHECK (intent_type IN ('featured_listing', 'sponsor', 'advertisement', 'premium_placement')),
  budget_range TEXT NOT NULL,
  subscription_type TEXT CHECK (subscription_type IN ('monthly', 'yearly')),
  monthly_fee DECIMAL(10,2),
  yearly_fee DECIMAL(10,2),
  ad_views_purchased INTEGER DEFAULT 0,
  ad_views_used INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'suspended', 'cancelled')),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service provider review responses table (paywall)
CREATE TABLE public.review_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES auth.users NOT NULL,
  review_id UUID NOT NULL, -- This would reference a reviews table when created
  response_text TEXT NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('per_response', 'subscription')),
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate payouts table
CREATE TABLE public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.affiliate_programs(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payout_method TEXT NOT NULL DEFAULT 'paypal',
  payout_details JSONB, -- Store payment details like PayPal email, bank info etc
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create pricing plans table to store the rates
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_type TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price_amount DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly', 'weekly', 'per_use')),
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the pricing plans based on your table
INSERT INTO public.pricing_plans (plan_type, plan_name, price_amount, billing_cycle, features) VALUES
('affiliate', 'Affiliate Commission', 10.00, 'per_use', '{"commission_rate": "10%", "description": "Commission on client first payment"}'),
('featured_client', 'Featured Monthly', 20.00, 'monthly', '{"type": "featured_listing"}'),
('featured_client', 'Featured Yearly', 200.00, 'yearly', '{"type": "featured_listing", "discount": "17%"}'),
('advertisement', 'Ad CPM', 0.02, 'per_use', '{"rate": "$20 per 1000 views"}'),
('advertisement', 'Ad Weekly', 100.00, 'weekly', '{"type": "flat_weekly_rate"}'),
('review_response', 'Per Response', 2.00, 'per_use', '{"type": "single_response"}'),
('review_response', 'Monthly Subscription', 20.00, 'monthly', '{"type": "unlimited_responses"}'),
('sponsor', 'Homepage Weekly', 200.00, 'weekly', '{"placement": "homepage"}'),
('sponsor', 'Homepage Monthly', 700.00, 'monthly', '{"placement": "homepage"}');

-- Enable RLS on all tables
ALTER TABLE public.affiliate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliate_programs
CREATE POLICY "Users can view their own affiliate program" 
  ON public.affiliate_programs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate program" 
  ON public.affiliate_programs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate program" 
  ON public.affiliate_programs FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for affiliate_referrals
CREATE POLICY "Affiliates can view their referrals" 
  ON public.affiliate_referrals FOR SELECT 
  USING (auth.uid() IN (SELECT user_id FROM public.affiliate_programs WHERE id = affiliate_id));

-- RLS Policies for featured_clients
CREATE POLICY "Users can view their own featured client applications" 
  ON public.featured_clients FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create featured client applications" 
  ON public.featured_clients FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own featured client applications" 
  ON public.featured_clients FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for review_responses
CREATE POLICY "Providers can view their own review responses" 
  ON public.review_responses FOR SELECT 
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can create review responses" 
  ON public.review_responses FOR INSERT 
  WITH CHECK (auth.uid() = provider_id);

-- RLS Policies for affiliate_payouts
CREATE POLICY "Affiliates can view their own payouts" 
  ON public.affiliate_payouts FOR SELECT 
  USING (auth.uid() IN (SELECT user_id FROM public.affiliate_programs WHERE id = affiliate_id));

-- Public read access for pricing plans
CREATE POLICY "Anyone can view pricing plans" 
  ON public.pricing_plans FOR SELECT 
  TO authenticated, anon USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX idx_affiliate_programs_user_id ON public.affiliate_programs(user_id);
CREATE INDEX idx_affiliate_referrals_affiliate_id ON public.affiliate_referrals(affiliate_id);
CREATE INDEX idx_featured_clients_user_id ON public.featured_clients(user_id);
CREATE INDEX idx_review_responses_provider_id ON public.review_responses(provider_id);
CREATE INDEX idx_affiliate_payouts_affiliate_id ON public.affiliate_payouts(affiliate_id);
