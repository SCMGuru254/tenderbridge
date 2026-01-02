-- Add Premium Job Features
-- This migration adds columns to support premium/featured job listings

-- 1. Add premium job columns to jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_is_premium ON public.jobs(is_premium) WHERE is_premium = true;
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON public.jobs(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_jobs_priority_score ON public.jobs(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_boost_expires ON public.jobs(boost_expires_at) WHERE boost_expires_at IS NOT NULL;

-- 3. Create function to auto-expire premium boosts
CREATE OR REPLACE FUNCTION expire_premium_jobs()
RETURNS void AS $$
BEGIN
    UPDATE public.jobs
    SET 
        is_premium = false,
        is_featured = false,
        priority_score = 0
    WHERE 
        boost_expires_at IS NOT NULL 
        AND boost_expires_at < timezone('utc'::text, now())
        AND (is_premium = true OR is_featured = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create job boost packages table
CREATE TABLE IF NOT EXISTS public.job_boost_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    priority_score INTEGER NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    price_kes NUMERIC NOT NULL,
    price_usd NUMERIC NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Insert default boost packages
INSERT INTO public.job_boost_packages (name, description, duration_days, priority_score, is_featured, price_kes, price_usd)
VALUES 
    ('Basic Boost', '7-day priority listing', 7, 10, false, 500, 5),
    ('Premium Boost', '14-day priority listing with featured badge', 14, 50, true, 1500, 15),
    ('Ultimate Boost', '30-day top placement with featured badge', 30, 100, true, 3000, 30)
ON CONFLICT DO NOTHING;

-- 6. Create job boost purchases table
CREATE TABLE IF NOT EXISTS public.job_boost_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    package_id UUID REFERENCES public.job_boost_packages(id) NOT NULL,
    transaction_reference TEXT, -- Links to paystack_transactions or manual_payment_claims
    amount_paid NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    boost_start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    boost_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS
ALTER TABLE public.job_boost_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_boost_purchases ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
DROP POLICY IF EXISTS "Public can view active packages" ON public.job_boost_packages;
CREATE POLICY "Public can view active packages" ON public.job_boost_packages 
    FOR SELECT 
    USING (is_active = true);

DROP POLICY IF EXISTS "Users can view own purchases" ON public.job_boost_purchases;
CREATE POLICY "Users can view own purchases" ON public.job_boost_purchases 
    FOR SELECT TO authenticated 
    USING (auth.uid() = user_id);

-- 9. Function to apply boost to job
CREATE OR REPLACE FUNCTION apply_job_boost(
    p_job_id UUID,
    p_package_id UUID,
    p_transaction_ref TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_package RECORD;
    v_job RECORD;
    v_boost_end TIMESTAMP WITH TIME ZONE;
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    -- Get package details
    SELECT * INTO v_package FROM public.job_boost_packages WHERE id = p_package_id AND is_active = true;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid boost package');
    END IF;
    
    -- Get job and verify ownership
    SELECT * INTO v_job FROM public.jobs WHERE id = p_job_id AND posted_by = v_user_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Job not found or unauthorized');
    END IF;
    
    -- Calculate boost end date
    v_boost_end := timezone('utc'::text, now()) + (v_package.duration_days || ' days')::INTERVAL;
    
    -- Update job with boost
    UPDATE public.jobs
    SET 
        is_premium = true,
        is_featured = v_package.is_featured,
        boost_expires_at = v_boost_end,
        priority_score = v_package.priority_score,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_job_id;
    
    -- Record purchase
    INSERT INTO public.job_boost_purchases (
        job_id, user_id, package_id, transaction_reference, 
        amount_paid, currency, boost_end_date
    ) VALUES (
        p_job_id, v_user_id, p_package_id, p_transaction_ref,
        v_package.price_kes, 'KES', v_boost_end
    );
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Job boosted successfully',
        'boost_expires_at', v_boost_end
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create view for active premium jobs
CREATE OR REPLACE VIEW public.premium_jobs_summary AS
SELECT 
    j.id,
    j.title,
    j.company_id,
    j.is_premium,
    j.is_featured,
    j.priority_score,
    j.boost_expires_at,
    j.views_count,
    c.name as company_name,
    CASE 
        WHEN j.boost_expires_at > timezone('utc'::text, now()) THEN 'active'
        ELSE 'expired'
    END as boost_status
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.id
WHERE j.is_premium = true OR j.is_featured = true;

ALTER VIEW public.premium_jobs_summary OWNER TO postgres;
GRANT SELECT ON public.premium_jobs_summary TO authenticated;

-- 11. Add comment for documentation
COMMENT ON COLUMN public.jobs.is_premium IS 'Job has active premium boost';
COMMENT ON COLUMN public.jobs.is_featured IS 'Job appears in featured section with badge';
COMMENT ON COLUMN public.jobs.priority_score IS 'Higher score = higher in listings (0-100)';
COMMENT ON COLUMN public.jobs.boost_expires_at IS 'When premium boost expires, NULL if never boosted';
COMMENT ON COLUMN public.jobs.views_count IS 'Number of times job was viewed';
