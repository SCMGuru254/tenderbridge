-- ============================================================
-- COMPREHENSIVE AFFILIATE & PAYMENT SECURITY MIGRATION
-- ============================================================

-- 1. ADD TERMS ACCEPTANCE TO AFFILIATE PROGRAMS
ALTER TABLE public.affiliate_programs
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS terms_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS ip_address_at_signup TEXT,
ADD COLUMN IF NOT EXISTS user_agent_at_signup TEXT;

-- Create index for admin querying
CREATE INDEX IF NOT EXISTS idx_affiliate_terms_accepted ON public.affiliate_programs(terms_accepted_at);

-- 2. ADD AFFILIATE ATTRIBUTION TO PAYSTACK TRANSACTIONS
ALTER TABLE public.paystack_transactions
ADD COLUMN IF NOT EXISTS affiliate_code TEXT,
ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliate_programs(id),
ADD COLUMN IF NOT EXISTS commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'calculated', 'paid', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_paystack_affiliate ON public.paystack_transactions(affiliate_code);

-- 3. CREATE FUNCTION TO CREDIT AFFILIATE ON SUCCESSFUL PAYMENT
CREATE OR REPLACE FUNCTION public.credit_affiliate_on_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_affiliate RECORD;
    v_commission NUMERIC;
BEGIN
    -- Only process if payment is successful and has affiliate code
    IF NEW.status = 'success' AND NEW.affiliate_code IS NOT NULL AND OLD.status != 'success' THEN
        -- Find the affiliate program by code
        SELECT * INTO v_affiliate 
        FROM public.affiliate_programs 
        WHERE affiliate_code = NEW.affiliate_code 
        AND status = 'active';
        
        IF FOUND THEN
            -- Calculate commission (using affiliate's commission rate)
            v_commission := NEW.amount * (v_affiliate.commission_rate / 100);
            
            -- Update the transaction with affiliate_id
            NEW.affiliate_id := v_affiliate.id;
            NEW.commission_status := 'calculated';
            
            -- Create referral record
            INSERT INTO public.affiliate_referrals (
                affiliate_id,
                referred_user_id,
                referral_type,
                conversion_amount,
                commission_earned,
                status,
                converted_at,
                transaction_reference
            ) VALUES (
                v_affiliate.id,
                NEW.user_id,
                'client',
                NEW.amount,
                v_commission,
                'converted',
                NOW(),
                NEW.reference
            );
            
            -- Update affiliate's pending payouts
            UPDATE public.affiliate_programs
            SET 
                pending_payouts = pending_payouts + v_commission,
                total_earnings = total_earnings + v_commission,
                updated_at = NOW()
            WHERE id = v_affiliate.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for affiliate commission
DROP TRIGGER IF EXISTS trigger_credit_affiliate ON public.paystack_transactions;
CREATE TRIGGER trigger_credit_affiliate
    BEFORE UPDATE ON public.paystack_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.credit_affiliate_on_payment();

-- 4. CREATE SECURE FUNCTION FOR AFFILIATE SIGNUP WITH TERMS ACCEPTANCE
CREATE OR REPLACE FUNCTION public.signup_affiliate_with_terms(
    p_terms_version TEXT DEFAULT '1.0',
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_affiliate_code TEXT;
    v_referral_link TEXT;
    v_result RECORD;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Authentication required');
    END IF;
    
    -- Check if already an affiliate
    IF EXISTS (SELECT 1 FROM public.affiliate_programs WHERE user_id = v_user_id) THEN
        RETURN jsonb_build_object('success', false, 'message', 'You are already an affiliate');
    END IF;
    
    -- Generate unique affiliate code
    v_affiliate_code := UPPER(SUBSTRING(MD5(v_user_id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    v_referral_link := 'https://supplychain-ke.lovable.app/?ref=' || v_affiliate_code;
    
    -- Insert affiliate program with terms acceptance
    INSERT INTO public.affiliate_programs (
        user_id,
        affiliate_code,
        referral_link,
        commission_rate,
        status,
        terms_accepted_at,
        terms_version,
        ip_address_at_signup,
        user_agent_at_signup
    ) VALUES (
        v_user_id,
        v_affiliate_code,
        v_referral_link,
        10,
        'pending',
        NOW(),
        p_terms_version,
        p_ip_address,
        p_user_agent
    )
    RETURNING * INTO v_result;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Affiliate application submitted! Admin will review shortly.',
        'affiliate_code', v_affiliate_code,
        'referral_link', v_referral_link
    );
END;
$$;

-- 5. CREATE ADMIN VIEW FOR AFFILIATE MANAGEMENT
CREATE OR REPLACE VIEW public.admin_affiliate_overview AS
SELECT 
    ap.id,
    ap.user_id,
    p.full_name,
    p.email,
    ap.affiliate_code,
    ap.commission_rate,
    ap.total_earnings,
    ap.pending_payouts,
    ap.total_paid_out,
    ap.status,
    ap.tier,
    ap.terms_accepted_at,
    ap.terms_version,
    ap.created_at,
    (SELECT COUNT(*) FROM affiliate_referrals ar WHERE ar.affiliate_id = ap.id) as total_referrals,
    (SELECT COUNT(*) FROM affiliate_referrals ar WHERE ar.affiliate_id = ap.id AND ar.status = 'converted') as converted_referrals
FROM public.affiliate_programs ap
LEFT JOIN public.profiles p ON ap.user_id = p.id
ORDER BY ap.created_at DESC;

-- 6. CREATE SECURE FUNCTION FOR PAYMENT INITIALIZATION WITH AFFILIATE TRACKING
CREATE OR REPLACE FUNCTION public.prepare_payment_with_affiliate(
    p_amount NUMERIC,
    p_purpose TEXT,
    p_affiliate_code TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_affiliate_valid BOOLEAN := false;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Authentication required');
    END IF;
    
    -- Validate affiliate code if provided
    IF p_affiliate_code IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM public.affiliate_programs 
            WHERE affiliate_code = p_affiliate_code 
            AND status = 'active'
            AND user_id != v_user_id
        ) INTO v_affiliate_valid;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'user_id', v_user_id,
        'amount', p_amount,
        'purpose', p_purpose,
        'affiliate_code', CASE WHEN v_affiliate_valid THEN p_affiliate_code ELSE NULL END,
        'affiliate_valid', v_affiliate_valid
    );
END;
$$;

-- 7. ADD RLS POLICIES FOR AFFILIATE TABLES IF MISSING
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_programs' 
        AND policyname = 'Users can view own affiliate program'
    ) THEN
        CREATE POLICY "Users can view own affiliate program" 
        ON public.affiliate_programs FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_programs' 
        AND policyname = 'Admins can view all affiliate programs'
    ) THEN
        CREATE POLICY "Admins can view all affiliate programs" 
        ON public.affiliate_programs FOR SELECT 
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_programs' 
        AND policyname = 'Admins can update affiliate programs'
    ) THEN
        CREATE POLICY "Admins can update affiliate programs" 
        ON public.affiliate_programs FOR UPDATE 
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- 8. GRANT EXECUTE ON NEW FUNCTIONS
GRANT EXECUTE ON FUNCTION public.signup_affiliate_with_terms TO authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_payment_with_affiliate TO authenticated;
GRANT EXECUTE ON FUNCTION public.credit_affiliate_on_payment TO authenticated;