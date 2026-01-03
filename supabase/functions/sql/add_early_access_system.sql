-- Job Seeker Early Access System
-- Allows job seekers to spend points to see jobs before others

-- 1. Add early access columns to jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS early_access_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS early_access_points_required INTEGER DEFAULT 0;

-- 2. Create early access purchases table
CREATE TABLE IF NOT EXISTS public.job_early_access_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    points_spent INTEGER NOT NULL,
    access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    access_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(user_id, job_id)
);

-- 3. Enable RLS
ALTER TABLE public.job_early_access_purchases ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Users can view own early access" ON public.job_early_access_purchases;
CREATE POLICY "Users can view own early access" ON public.job_early_access_purchases 
    FOR SELECT TO authenticated 
    USING (auth.uid() = user_id);

-- 5. Add EARLY_JOB_ACCESS to reward redemption types
CREATE OR REPLACE FUNCTION redeem_early_job_access(
    p_job_id UUID,
    p_points_to_spend INTEGER DEFAULT 20
)
RETURNS JSONB AS $$
DECLARE
    current_bal INTEGER;
    user_id UUID;
    v_job RECORD;
    v_access_expires TIMESTAMP WITH TIME ZONE;
BEGIN
    user_id := auth.uid();
    
    -- Security Check 1: User must be authenticated
    IF user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Authentication required');
    END IF;
    
    -- Check if job exists and is in early access period
    SELECT * INTO v_job FROM public.jobs 
    WHERE id = p_job_id 
    AND early_access_until IS NOT NULL 
    AND early_access_until > timezone('utc'::text, now());
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Job not in early access period');
    END IF;
    
    -- Check if user already has access
    IF EXISTS (
        SELECT 1 FROM public.job_early_access_purchases 
        WHERE user_id = redeem_early_job_access.user_id 
        AND job_id = p_job_id
    ) THEN
        RETURN jsonb_build_object('success', false, 'message', 'You already have access to this job');
    END IF;
    
    -- Check points balance
    SELECT current_points INTO current_bal 
    FROM public.user_rewards 
    WHERE public.user_rewards.user_id = redeem_early_job_access.user_id;
    
    IF current_bal IS NULL OR current_bal < p_points_to_spend THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient points');
    END IF;
    
    -- Deduct points
    INSERT INTO public.reward_transactions (user_id, amount, transaction_type, description)
    VALUES (user_id, -p_points_to_spend, 'SPEND_EARLY_ACCESS', 'Early access to job: ' || v_job.title);
    
    -- Grant access
    v_access_expires := v_job.early_access_until;
    INSERT INTO public.job_early_access_purchases (user_id, job_id, points_spent, access_expires_at)
    VALUES (user_id, p_job_id, p_points_to_spend, v_access_expires);
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Early access granted!',
        'access_expires_at', v_access_expires
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Function to check if user has access to a job
CREATE OR REPLACE FUNCTION user_can_view_job(p_job_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    v_job RECORD;
    v_user_id UUID;
BEGIN
    v_user_id := COALESCE(p_user_id, auth.uid());
    
    -- Get job details
    SELECT * INTO v_job FROM public.jobs WHERE id = p_job_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- If job is not in early access, everyone can see it
    IF v_job.early_access_until IS NULL OR v_job.early_access_until <= timezone('utc'::text, now()) THEN
        RETURN true;
    END IF;
    
    -- If user is not logged in, they can't see early access jobs
    IF v_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if user purchased early access
    IF EXISTS (
        SELECT 1 FROM public.job_early_access_purchases 
        WHERE user_id = v_user_id 
        AND job_id = p_job_id
        AND access_expires_at > timezone('utc'::text, now())
    ) THEN
        RETURN true;
    END IF;
    
    -- Check if user is the job poster (employers can always see their own jobs)
    IF EXISTS (
        SELECT 1 FROM public.jobs 
        WHERE id = p_job_id 
        AND posted_by = v_user_id
    ) THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update jobs RLS policy to respect early access
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs 
    FOR SELECT 
    USING (
        is_active = true 
        AND (
            early_access_until IS NULL 
            OR early_access_until <= timezone('utc'::text, now())
            OR user_can_view_job(id, auth.uid())
        )
    );

-- 8. Create view for jobs requiring early access
CREATE OR REPLACE VIEW public.early_access_jobs AS
SELECT 
    j.id,
    j.title,
    j.company_id,
    j.early_access_until,
    j.early_access_points_required,
    c.name as company_name,
    CASE 
        WHEN j.early_access_until > timezone('utc'::text, now()) THEN 'active'
        ELSE 'expired'
    END as early_access_status
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.id
WHERE j.early_access_until IS NOT NULL
AND j.is_active = true;

ALTER VIEW public.early_access_jobs OWNER TO postgres;
GRANT SELECT ON public.early_access_jobs TO authenticated;

-- 9. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_early_access ON public.jobs(early_access_until) WHERE early_access_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_early_access_purchases_user ON public.job_early_access_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_early_access_purchases_job ON public.job_early_access_purchases(job_id);

-- 10. Add comments for documentation
COMMENT ON COLUMN public.jobs.early_access_until IS 'Job is only visible to users who purchased early access until this time';
COMMENT ON COLUMN public.jobs.early_access_points_required IS 'Points required to unlock early access (default 20)';
COMMENT ON TABLE public.job_early_access_purchases IS 'Tracks which users purchased early access to which jobs';
