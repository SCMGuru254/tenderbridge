-- 1. Update Review Response Monthly to Ksh 2000 lifetime (using yearly cycle with lifetime flag)
UPDATE public.pricing_plans 
SET 
  plan_name = 'Lifetime Subscription',
  price_amount = 2000.00,
  billing_cycle = 'per_use',
  features = jsonb_build_object('type', 'unlimited_responses', 'currency', 'KES', 'is_lifetime', true, 'description', 'One-time payment for lifetime access'),
  updated_at = NOW()
WHERE id = '1093a09c-5b60-46de-84e5-9f2baa61ece2';

-- 2. Delete Review Response - Single (Per Response)
DELETE FROM public.pricing_plans 
WHERE id = '65eba20b-fc17-4a90-aef6-99299462e35a';

-- 3. Update Homepage Sponsor Monthly to KES 4500/year
UPDATE public.pricing_plans 
SET 
  plan_name = 'Homepage Yearly',
  price_amount = 4500.00,
  billing_cycle = 'yearly',
  features = jsonb_build_object('placement', 'homepage', 'currency', 'KES'),
  updated_at = NOW()
WHERE id = '05480dfe-255a-46e4-a881-479e2ea63fff';

-- 4. Update Homepage Weekly to KES 2000/week
UPDATE public.pricing_plans 
SET 
  plan_name = 'Homepage Weekly',
  price_amount = 2000.00,
  billing_cycle = 'weekly',
  features = jsonb_build_object('placement', 'homepage', 'currency', 'KES'),
  updated_at = NOW()
WHERE id = '6f0a8864-1fe9-4ca6-9a19-6824f9d625e5';

-- 5. Update Advertisement Weekly to KES 3000/month
UPDATE public.pricing_plans 
SET 
  plan_name = 'Ad Monthly',
  price_amount = 3000.00,
  billing_cycle = 'monthly',
  features = jsonb_build_object('type', 'flat_monthly_rate', 'currency', 'KES'),
  updated_at = NOW()
WHERE id = 'ea240b8c-9d2c-47ad-bd67-1f0b6258eed8';