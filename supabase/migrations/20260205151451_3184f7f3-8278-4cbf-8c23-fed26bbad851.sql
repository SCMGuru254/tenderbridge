-- ==========================================================
-- ROLE & SUBSCRIPTION SYSTEM FOR SUPPLY CHAIN KE
-- ==========================================================

-- 1. Create role enum for type safety
DO $$ BEGIN
    CREATE TYPE public.platform_role AS ENUM (
        'job_seeker',      -- Candidates looking for jobs
        'employer',        -- SMEs posting jobs
        'hr_professional', -- Recruiters, HR teams
        'trainer',         -- Course instructors
        'affiliate',       -- Growth partners
        'admin'            -- Platform admins
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add role column to user_roles if not exists (migrate from text to enum)
-- First drop if exists and recreate with proper structure
DROP TABLE IF EXISTS public.user_roles CASCADE;

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role platform_role NOT NULL,
    granted_at timestamp with time zone DEFAULT now(),
    granted_by uuid REFERENCES auth.users(id),
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true,
    UNIQUE (user_id, role)
);

-- 3. Create employer subscriptions table
CREATE TABLE IF NOT EXISTS public.employer_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
    plan_type text NOT NULL CHECK (plan_type IN ('standard', 'growth', 'enterprise')),
    price_paid numeric(10,2) NOT NULL,
    currency text DEFAULT 'KES',
    payment_reference text,
    starts_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true,
    features jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. Create job seeker pro membership table
CREATE TABLE IF NOT EXISTS public.jobseeker_pro_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    acquired_via text NOT NULL CHECK (acquired_via IN ('payment', 'points')),
    points_spent integer DEFAULT 0,
    price_paid numeric(10,2) DEFAULT 0,
    payment_reference text,
    starts_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true,
    features jsonb DEFAULT '{"early_access": true, "verified_badge": true, "unlimited_ai_chat": true}',
    created_at timestamp with time zone DEFAULT now()
);

-- 5. Create trainer subscriptions table
CREATE TABLE IF NOT EXISTS public.trainer_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    listing_fee_paid numeric(10,2) NOT NULL,
    course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
    payment_reference text,
    payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'refunded')),
    created_at timestamp with time zone DEFAULT now()
);

-- 6. Enable RLS on all new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobseeker_pro_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_subscriptions ENABLE ROW LEVEL SECURITY;

-- 7. Update has_role function to use new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role platform_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- 8. Function to assign role on subscription
CREATE OR REPLACE FUNCTION public.assign_role_on_subscription(
    p_user_id uuid,
    p_role platform_role,
    p_expires_at timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role, expires_at, is_active)
    VALUES (p_user_id, p_role, p_expires_at, true)
    ON CONFLICT (user_id, role) 
    DO UPDATE SET 
        expires_at = COALESCE(p_expires_at, user_roles.expires_at),
        is_active = true;
END;
$$;

-- 9. RLS Policies

-- user_roles: Users can see their own roles, admins can see all
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- employer_subscriptions: Users see own, admins see all
CREATE POLICY "Users can view their own subscriptions" 
ON public.employer_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
ON public.employer_subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all employer subscriptions"
ON public.employer_subscriptions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- jobseeker_pro_memberships: Users see own
CREATE POLICY "Users can view their own pro membership" 
ON public.jobseeker_pro_memberships FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pro membership" 
ON public.jobseeker_pro_memberships FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all pro memberships"
ON public.jobseeker_pro_memberships FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- trainer_subscriptions: Users see own
CREATE POLICY "Users can view their own trainer subscriptions" 
ON public.trainer_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trainer subscriptions" 
ON public.trainer_subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all trainer subscriptions"
ON public.trainer_subscriptions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 10. Helper function to check subscription status
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'roles', (
            SELECT jsonb_agg(role) 
            FROM user_roles 
            WHERE user_id = p_user_id 
            AND is_active = true 
            AND (expires_at IS NULL OR expires_at > now())
        ),
        'employer_subscription', (
            SELECT jsonb_build_object(
                'plan_type', plan_type,
                'expires_at', expires_at,
                'is_active', is_active AND expires_at > now()
            )
            FROM employer_subscriptions 
            WHERE user_id = p_user_id 
            AND is_active = true 
            ORDER BY expires_at DESC 
            LIMIT 1
        ),
        'pro_membership', (
            SELECT jsonb_build_object(
                'expires_at', expires_at,
                'is_active', is_active AND expires_at > now(),
                'features', features
            )
            FROM jobseeker_pro_memberships 
            WHERE user_id = p_user_id 
            AND is_active = true 
            AND expires_at > now()
        ),
        'is_affiliate', EXISTS (
            SELECT 1 FROM affiliate_programs 
            WHERE user_id = p_user_id 
            AND status = 'active'
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- 11. Add updated_at trigger for employer_subscriptions
CREATE TRIGGER update_employer_subscriptions_updated_at
BEFORE UPDATE ON public.employer_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();