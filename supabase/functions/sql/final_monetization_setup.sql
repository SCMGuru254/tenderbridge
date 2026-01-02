-- CRITICAL: Drop any existing admin_pending_tasks view first to prevent conflicts
DROP VIEW IF EXISTS public.admin_pending_tasks CASCADE;

-- 1. Paystack Transactions Table (Primary Gateway)
CREATE TABLE IF NOT EXISTS public.paystack_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    reference TEXT NOT NULL UNIQUE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'KES',
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, success, failed
    payment_purpose TEXT NOT NULL, -- 'COURSE_LISTING', 'PRO_SUBSCRIPTION', 'COMPANY_VERIFICATION'
    metadata JSONB, -- DETAILED TRACKING: { "affiliate_code": "SCM_JANE", "event_id": "123", "payer_name": "Olive" }
    paystack_response JSONB,
    last_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PayPal Transactions Table (Secondary/Settlement)
CREATE TABLE IF NOT EXISTS public.paypal_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    order_id TEXT NOT NULL UNIQUE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    payer_email TEXT,
    status TEXT DEFAULT 'PENDING',
    payment_purpose TEXT NOT NULL, -- 'COURSE_LISTING', 'PRO_SUBSCRIPTION'
    metadata JSONB, -- { "affiliate_code": "SCM_JANE", "plan_type": "growth" }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Secure Manual Payment Methods (Authorized Details Only)
CREATE TABLE IF NOT EXISTS public.manual_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'mpesa_send_money', 'bank_transfer'
    name TEXT NOT NULL, -- 'Olive Etsula', 'Company Account'
    account_number TEXT NOT NULL, 
    account_name TEXT, 
    instructions TEXT, 
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Affiliate Programs Update (Adding Tiers)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_programs' AND column_name = 'tier') THEN
        ALTER TABLE public.affiliate_programs ADD COLUMN tier TEXT DEFAULT 'silver' CHECK (tier IN ('silver', 'gold', 'platinum'));
    END IF;
END $$;

-- 4b. Affiliate Check - Add Transaction Tracking & Status (Granular Visibility)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_referrals' AND column_name = 'transaction_reference') THEN
        ALTER TABLE public.affiliate_referrals ADD COLUMN transaction_reference TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_referrals' AND column_name = 'referral_status') THEN
        ALTER TABLE public.affiliate_referrals ADD COLUMN referral_status TEXT DEFAULT 'clicked';
    END IF;
END $$;

-- 5. Enable RLS on New Tables
ALTER TABLE public.paystack_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paypal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_payment_methods ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (STRICT SECURITY)
DROP POLICY IF EXISTS "Users can view own transactions" ON public.paystack_transactions;
CREATE POLICY "Users can view own transactions" ON public.paystack_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own paypal" ON public.paypal_transactions;
CREATE POLICY "Users can view own paypal" ON public.paypal_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can read active methods" ON public.manual_payment_methods;
CREATE POLICY "Authenticated users can read active methods" ON public.manual_payment_methods FOR SELECT TO authenticated USING (is_active = true);

-- 7. Insert Default Manual Payment (Olive Etsula)
INSERT INTO public.manual_payment_methods (type, name, account_number, account_name, instructions)
SELECT 'mpesa_send_money', 'M-Pesa Send Money', '07XX XXX XXX', 'Olive Etsula', 'Go to M-Pesa -> Send Money to 07XX... -> Copy Confirmation Code'
WHERE NOT EXISTS (SELECT 1 FROM public.manual_payment_methods WHERE account_name = 'Olive Etsula');

-- 8. AFFILIATE SECURITY (Anti-Fraud)
ALTER TABLE public.affiliate_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own affiliate program" ON public.affiliate_programs;
CREATE POLICY "Users can view own affiliate program" ON public.affiliate_programs 
    FOR SELECT TO authenticated 
    USING (auth.uid() = user_id);

-- Prevent Self-Referral Trigger
CREATE OR REPLACE FUNCTION check_self_referral()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.affiliate_programs ap
        WHERE ap.id = NEW.affiliate_id
        AND ap.user_id = NEW.referred_user_id
    ) THEN
        RAISE EXCEPTION 'Fraud Detected: You cannot earn commissions on your own account.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_self_referral ON public.affiliate_referrals;
CREATE TRIGGER trigger_prevent_self_referral
    BEFORE INSERT ON public.affiliate_referrals
    FOR EACH ROW
    EXECUTE FUNCTION check_self_referral();

-- Enforce "Verified Influencer" Policy
CREATE OR REPLACE FUNCTION check_affiliate_eligibility()
RETURNS TRIGGER AS $$
BEGIN
    NEW.status := 'pending'; 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_affiliate_eligibility ON public.affiliate_programs;
CREATE TRIGGER trigger_check_affiliate_eligibility
    BEFORE INSERT ON public.affiliate_programs
    FOR EACH ROW
    EXECUTE FUNCTION check_affiliate_eligibility();

-- 9. ADMIN AUDIT TRAIL
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) NOT NULL,
    action_type TEXT NOT NULL, 
    target_id UUID NOT NULL, 
    details JSONB, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 9b. IMMUTABLE LOGS
CREATE OR REPLACE FUNCTION prevent_log_deletion()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Security Violation: Admin Logs are Immutable and cannot be deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_protect_admin_logs ON public.admin_activity_logs;
CREATE TRIGGER trigger_protect_admin_logs
    BEFORE DELETE ON public.admin_activity_logs
    FOR EACH STATEMENT
    EXECUTE FUNCTION prevent_log_deletion();

-- 11. PERFORMANCE INDEXING
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON public.affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_paystack_reference ON public.paystack_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_paystack_user_id ON public.paystack_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_activity_logs(admin_id);

-- 13. MANUAL PAYMENT CLAIMS (M-Pesa Verification)
CREATE TABLE IF NOT EXISTS public.manual_payment_claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount NUMERIC NOT NULL,
    mpesa_code TEXT NOT NULL UNIQUE, 
    sender_name TEXT, -- Captures "John Doe"
    payment_purpose TEXT NOT NULL, 
    metadata JSONB, 
    status TEXT DEFAULT 'pending_verification',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_mpesa_code CHECK (char_length(mpesa_code) >= 10)
);

ALTER TABLE public.manual_payment_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create claims" ON public.manual_payment_claims;
CREATE POLICY "Users can create claims" ON public.manual_payment_claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own claims" ON public.manual_payment_claims;
CREATE POLICY "Users can view own claims" ON public.manual_payment_claims FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 13b. SANITIZE MPESA CODES
CREATE OR REPLACE FUNCTION normalize_mpesa_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.mpesa_code := UPPER(TRIM(NEW.mpesa_code)); 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_normalize_mpesa ON public.manual_payment_claims;
CREATE TRIGGER trigger_normalize_mpesa
    BEFORE INSERT ON public.manual_payment_claims
    FOR EACH ROW
    EXECUTE FUNCTION normalize_mpesa_code();

-- 14. AFFILIATE PAYOUTS (Finance Tracker)
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.affiliate_programs(id) NOT NULL,
    amount NUMERIC NOT NULL,
    payout_method TEXT NOT NULL, 
    payout_details JSONB, 
    status TEXT DEFAULT 'processed',
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT
);

ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Affiliates view own payouts" ON public.affiliate_payouts;
CREATE POLICY "Affiliates view own payouts" ON public.affiliate_payouts
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.affiliate_programs ap
            WHERE ap.id = affiliate_payouts.affiliate_id
            AND ap.user_id = auth.uid()
        )
    );

-- 15. GOD MODE VIEW (Base version - will be updated by reward_security_hardening.sql)
CREATE OR REPLACE VIEW public.admin_pending_tasks AS
    SELECT 
        'COURSE_APPROVAL' as task_type,
        id::text as reference_id,
        'Approve Course: ' || title as description,
        created_at as urgency_timestamp,
        CASE WHEN status = 'pending' THEN 'HIGH' ELSE 'medium' END as priority
    FROM public.courses 
    WHERE status = 'pending' OR status = 'pending_approval'

    UNION ALL

    SELECT
        'MANUAL_VERIFICATION' as task_type,
        id::text as reference_id,
        'Verify M-Pesa: ' || mpesa_code || ' from ' || COALESCE(sender_name, 'Unknown') || ' (KES ' || amount || ')' as description,
        created_at as urgency_timestamp,
        'HIGH' as priority
    FROM public.manual_payment_claims
    WHERE status = 'pending_verification'

    UNION ALL

    SELECT 
        'PAYOUT_REQUEST' as task_type,
        user_id::text as reference_id,
        'Payout Due: ' || affiliate_code || ' (KES ' || pending_payouts || ')' as description,
        updated_at as urgency_timestamp,
        'HIGH' as priority
    FROM public.affiliate_programs
    WHERE pending_payouts >= 1000

    UNION ALL

    SELECT 
        'CONTENT_REPORT' as task_type,
        id::text as reference_id,
        'Reported: ' || reason as description,
        created_at as urgency_timestamp,
        'medium' as priority
    FROM public.job_reports
    WHERE status = 'pending';

ALTER VIEW public.admin_pending_tasks OWNER TO postgres;
GRANT SELECT ON public.admin_pending_tasks TO authenticated;

-- 16. ADMIN STATS
CREATE OR REPLACE VIEW public.admin_affiliate_stats AS
SELECT 
    ap.user_id,
    ap.affiliate_code,
    ap.tier,
    COUNT(ar.id) FILTER (WHERE ar.referral_status = 'signed_up') as total_signups,
    COUNT(ar.id) FILTER (WHERE ar.referral_status = 'converted_paid') as total_sales,
    SUM(ar.commission_earned) as total_commission_owed
FROM public.affiliate_programs ap
LEFT JOIN public.affiliate_referrals ar ON ap.id = ar.affiliate_id
GROUP BY ap.id, ap.user_id, ap.affiliate_code, ap.tier;

ALTER VIEW public.admin_affiliate_stats OWNER TO postgres;
GRANT SELECT ON public.admin_affiliate_stats TO authenticated;
