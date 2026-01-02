-- JOB BOOST SYSTEM
-- Allows employers to pay to boost their job visibility

-- 1. Create boost packages table
CREATE TABLE IF NOT EXISTS public.job_boost_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    priority_score INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    price_kes DECIMAL(10,2) NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert default packages
INSERT INTO public.job_boost_packages (name, description, duration_days, priority_score, is_featured, price_kes, price_usd)
VALUES 
    ('Standard Boost', 'Get noticed with priority placement', 3, 10, false, 1500, 15),
    ('Pro Boost', 'Maximum visibility + Featured badge', 7, 20, true, 3500, 35),
    ('Elite Boost', 'Dominate search results for 2 weeks', 14, 30, true, 6000, 60)
ON CONFLICT DO NOTHING;

-- 3. Enable RLS
ALTER TABLE public.job_boost_packages ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Anyone can view active boost packages" ON public.job_boost_packages;
CREATE POLICY "Anyone can view active boost packages" ON public.job_boost_packages 
    FOR SELECT USING (is_active = true);

-- Only admins can manage packages
DROP POLICY IF EXISTS "Admins manage boost packages" ON public.job_boost_packages;
CREATE POLICY "Admins manage boost packages" ON public.job_boost_packages 
    FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 5. Add boost columns to jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS boosted_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS boost_package_id UUID REFERENCES public.job_boost_packages(id);
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0;

-- 6. RPC to apply a boost
CREATE OR REPLACE FUNCTION apply_job_boost(p_job_id UUID, p_package_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_package RECORD;
    v_job RECORD;
    v_new_expiry TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get package details
    SELECT * INTO v_package FROM public.job_boost_packages WHERE id = p_package_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid package');
    END IF;

    -- Get job details
    SELECT * INTO v_job FROM public.jobs WHERE id = p_job_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Job not found');
    END IF;

    -- Verify ownership (unless admin)
    IF v_job.posted_by != auth.uid() AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    -- Calculate new expiry
    -- If already boosted, extend from current expiry? or just set from now?
    -- Let's set from NOW() for simplicity, or extend if currently active.
    IF v_job.boosted_until > NOW() THEN
        v_new_expiry := v_job.boosted_until + (v_package.duration_days || ' days')::INTERVAL;
    ELSE
        v_new_expiry := NOW() + (v_package.duration_days || ' days')::INTERVAL;
    END IF;

    -- Update job
    UPDATE public.jobs 
    SET 
        boosted_until = v_new_expiry,
        boost_package_id = p_package_id,
        is_featured = v_package.is_featured,
        priority_score = v_package.priority_score
    WHERE id = p_job_id;

    -- Log transaction (Optional - normally you'd handle payment first)
    INSERT INTO public.paystack_transactions (
        user_id, 
        reference, 
        amount, 
        currency, 
        status, 
        payment_purpose
    ) VALUES (
        auth.uid(),
        'BOOST-' || p_job_id || '-' || EXTRACT(EPOCH FROM NOW())::TEXT,
        v_package.price_kes,
        'KES',
        'success', -- Simulated success
        'JOB_BOOST'
    );

    RETURN jsonb_build_object('success', true, 'message', 'Job boosted successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
