-- =====================================================
-- JOB BOOST PACKAGES UPDATE - New Pricing Structure
-- =====================================================

-- First, deactivate all existing packages to prevent conflicts
UPDATE public.job_boost_packages 
SET is_active = false 
WHERE is_active = true;

-- Insert new packages with updated pricing
-- 1. Standard Boost - KES 200
INSERT INTO public.job_boost_packages (
  name, description, duration_days, price_kes, price_usd, priority_score, is_active, is_featured
) VALUES (
  'Standard Boost',
  '1 job posting (30 days visibility), 7-day boost (higher in search), "Featured" badge for 7 days',
  7,
  200,
  2,
  10,
  true,
  true
);

-- 2. Pro Boost - KES 500
INSERT INTO public.job_boost_packages (
  name, description, duration_days, price_kes, price_usd, priority_score, is_active, is_featured
) VALUES (
  'Pro Boost',
  '5 job postings (each 30 days visibility), Each job gets 7-day boost + "Featured" badge. Great for shops, farms, schools, transporters.',
  7,
  500,
  5,
  50,
  true,
  true
);

-- 3. Ultimate Boost - KES 2,500
INSERT INTO public.job_boost_packages (
  name, description, duration_days, price_kes, price_usd, priority_score, is_active, is_featured
) VALUES (
  'Ultimate Boost',
  '5 job postings (each 30 days visibility), Each job gets lifelong boost (always at the top) + permanent "Featured" badge. Ideal for big SMEs, factories, big projects, recruitment agencies.',
  365,
  2500,
  25,
  100,
  true,
  true
);

-- 4. Urgent Add-on - KES 50
INSERT INTO public.job_boost_packages (
  name, description, duration_days, price_kes, price_usd, priority_score, is_active, is_featured
) VALUES (
  'Urgent Add-on',
  'Add urgent visibility - appears in "Urgent Jobs" section for 48 hours. Perfect for immediate hiring needs.',
  2,
  50,
  0.50,
  200,
  true,
  false
);

-- =====================================================
-- FREE JOB CLAIM SYSTEM - For first-time employers
-- =====================================================

-- Create table to track free job claims
CREATE TABLE IF NOT EXISTS public.free_job_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'used')),
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  used_at TIMESTAMP WITH TIME ZONE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.free_job_claims ENABLE ROW LEVEL SECURITY;

-- Policies for free_job_claims
CREATE POLICY "Users can view their own claims" 
ON public.free_job_claims 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own claim" 
ON public.free_job_claims 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all claims" 
ON public.free_job_claims 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update claims" 
ON public.free_job_claims 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_free_job_claims_user_id ON public.free_job_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_free_job_claims_status ON public.free_job_claims(status);

-- =====================================================
-- EMPLOYER REWARDS TABLE
-- =====================================================

-- Create employer rewards tracking
CREATE TABLE IF NOT EXISTS public.employer_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('first_hire', 'bulk_posting', 'referral', 'loyalty', 'quality_employer')),
  points_earned INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employer_rewards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Employers can view their own rewards" 
ON public.employer_rewards 
FOR SELECT 
USING (auth.uid() = employer_id);

CREATE POLICY "System can insert rewards" 
ON public.employer_rewards 
FOR INSERT 
WITH CHECK (true);

-- Add employer_total_rewards to track totals
CREATE OR REPLACE VIEW public.employer_rewards_summary AS
SELECT 
  employer_id,
  SUM(points_earned) as total_points,
  COUNT(*) as total_rewards,
  MAX(earned_at) as last_reward_date
FROM public.employer_rewards
GROUP BY employer_id;

-- =====================================================
-- UPDATE PRICING PLANS FOR FEATURED/SPONSOR PACKAGES
-- =====================================================

-- Add employer-specific pricing plans if they don't exist
INSERT INTO public.pricing_plans (
  plan_name, plan_type, price_amount, billing_cycle, features, is_active
) VALUES 
(
  'Free Job Posting',
  'employer',
  0,
  'per_use',
  '{"job_postings": 1, "visibility_days": 30, "basic_analytics": true, "shortlist_tools": true, "contact_applicants": true, "currency": "KES", "is_free": true}'::jsonb,
  true
),
(
  'Standard Boost',
  'job_boost',
  200,
  'per_use',
  '{"job_postings": 1, "boost_days": 7, "visibility_days": 30, "featured_badge": true, "higher_search_ranking": true, "currency": "KES"}'::jsonb,
  true
),
(
  'Pro Boost',
  'job_boost',
  500,
  'per_use',
  '{"job_postings": 5, "boost_days": 7, "visibility_days": 30, "featured_badge": true, "higher_search_ranking": true, "currency": "KES", "cost_per_job": 100}'::jsonb,
  true
),
(
  'Ultimate Boost',
  'job_boost',
  2500,
  'per_use',
  '{"job_postings": 5, "boost_days": 365, "visibility_days": 30, "featured_badge": true, "permanent_top_ranking": true, "currency": "KES", "is_lifetime": true}'::jsonb,
  true
),
(
  'Urgent Add-on',
  'job_boost',
  50,
  'per_use',
  '{"urgent_visibility_hours": 48, "urgent_jobs_section": true, "currency": "KES"}'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Add job_postings_remaining to track employer allocations
-- =====================================================

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS free_claim_used BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS boost_type TEXT,
ADD COLUMN IF NOT EXISTS urgent_until TIMESTAMP WITH TIME ZONE;

-- Add index for urgent jobs
CREATE INDEX IF NOT EXISTS idx_jobs_urgent_until ON public.jobs(urgent_until) WHERE urgent_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_boosted_until ON public.jobs(boosted_until) WHERE boosted_until IS NOT NULL;