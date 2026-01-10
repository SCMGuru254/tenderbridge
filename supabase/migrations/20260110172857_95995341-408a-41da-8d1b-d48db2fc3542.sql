-- ============================================================
-- SECURITY FIXES: Convert SECURITY DEFINER Views to INVOKER
-- ============================================================

-- 1. Fix visible_profiles view with correct columns
DROP VIEW IF EXISTS public.visible_profiles;
CREATE VIEW public.visible_profiles 
WITH (security_invoker = true)
AS
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.avatar_url,
    p.bio,
    p.position,
    p.company,
    p.location,
    p.linkedin_url,
    p.skills,
    p.experience_level,
    p.visibility,
    p.tagline,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE p.visibility IN ('public', 'recruiters', 'connections');

-- 2. Fix early_access_jobs view
DROP VIEW IF EXISTS public.early_access_jobs;
CREATE VIEW public.early_access_jobs
WITH (security_invoker = true)
AS
SELECT 
    j.*,
    c.name as company_name,
    c.description as company_description,
    c.location as company_location,
    c.website as company_website
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.id
WHERE j.early_access_until IS NOT NULL 
AND j.early_access_until > timezone('utc'::text, now())
AND j.is_active = true;

-- 3. Fix premium_jobs_summary view  
DROP VIEW IF EXISTS public.premium_jobs_summary;
CREATE VIEW public.premium_jobs_summary
WITH (security_invoker = true)
AS
SELECT 
    j.id,
    j.title,
    j.location,
    j.job_type,
    j.salary_range,
    j.is_premium,
    j.is_featured,
    j.priority_score,
    j.boost_expires_at,
    j.created_at,
    c.name as company_name
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.id
WHERE j.is_active = true
AND (j.is_premium = true OR j.is_featured = true)
ORDER BY j.priority_score DESC NULLS LAST, j.created_at DESC;

-- 4. Add missing RLS policies for tables with RLS enabled but no policies

-- For paystack_transactions: Add user-specific policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'paystack_transactions' 
        AND policyname = 'Users can view own transactions'
    ) THEN
        CREATE POLICY "Users can view own transactions" 
        ON public.paystack_transactions FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'paystack_transactions' 
        AND policyname = 'Users can insert own transactions'
    ) THEN
        CREATE POLICY "Users can insert own transactions" 
        ON public.paystack_transactions FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'paystack_transactions' 
        AND policyname = 'Admins can view all transactions'
    ) THEN
        CREATE POLICY "Admins can view all transactions" 
        ON public.paystack_transactions FOR SELECT 
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'paystack_transactions' 
        AND policyname = 'Admins can update transactions'
    ) THEN
        CREATE POLICY "Admins can update transactions" 
        ON public.paystack_transactions FOR UPDATE 
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- For affiliate_referrals: Add policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_referrals' 
        AND policyname = 'Affiliates can view own referrals'
    ) THEN
        CREATE POLICY "Affiliates can view own referrals" 
        ON public.affiliate_referrals FOR SELECT 
        USING (
            EXISTS (
                SELECT 1 FROM public.affiliate_programs ap 
                WHERE ap.id = affiliate_id 
                AND ap.user_id = auth.uid()
            )
        );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_referrals' 
        AND policyname = 'Admins can manage referrals'
    ) THEN
        CREATE POLICY "Admins can manage referrals" 
        ON public.affiliate_referrals FOR ALL 
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- For affiliate_payouts: Add policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_payouts' 
        AND policyname = 'Affiliates can view own payouts'
    ) THEN
        CREATE POLICY "Affiliates can view own payouts" 
        ON public.affiliate_payouts FOR SELECT 
        USING (
            EXISTS (
                SELECT 1 FROM public.affiliate_programs ap 
                WHERE ap.id = affiliate_id 
                AND ap.user_id = auth.uid()
            )
        );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_payouts' 
        AND policyname = 'Affiliates can request payouts'
    ) THEN
        CREATE POLICY "Affiliates can request payouts" 
        ON public.affiliate_payouts FOR INSERT 
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM public.affiliate_programs ap 
                WHERE ap.id = affiliate_id 
                AND ap.user_id = auth.uid()
                AND ap.status = 'active'
            )
        );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_payouts' 
        AND policyname = 'Admins can manage payouts'
    ) THEN
        CREATE POLICY "Admins can manage payouts" 
        ON public.affiliate_payouts FOR ALL 
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;