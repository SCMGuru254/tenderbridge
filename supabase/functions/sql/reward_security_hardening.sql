-- SECURITY HARDENING FOR REWARDS SYSTEM
-- ⚠️ IMPORTANT: Run this AFTER create_reward_system.sql
-- This file adds additional security measures to prevent abuse

-- 1. RATE LIMITING ON REDEMPTIONS (Prevent Spam)
CREATE OR REPLACE FUNCTION redeem_reward(amount_to_spend INTEGER, reward_type TEXT)
RETURNS JSONB AS $$
DECLARE
    current_bal INTEGER;
    user_id UUID;
    recent_redemptions INTEGER;
BEGIN
    user_id := auth.uid();
    
    -- Security Check 1: User must be authenticated
    IF user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Authentication required');
    END IF;
    
    -- Security Check 2: Validate reward_type (Prevent SQL Injection)
    IF reward_type NOT IN ('PROFILE_HIGHLIGHT', 'CV_REVIEW', 'CAREER_COACHING') THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid reward type');
    END IF;
    
    -- Security Check 3: Rate Limiting (Max 5 redemptions per day)
    SELECT COUNT(*) INTO recent_redemptions
    FROM public.redemption_requests
    WHERE user_id = redeem_reward.user_id
    AND created_at > CURRENT_DATE::timestamp;
    
    IF recent_redemptions >= 5 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Daily redemption limit reached');
    END IF;
    
    -- Security Check 4: Validate Points Balance
    SELECT current_points INTO current_bal FROM public.user_rewards WHERE public.user_rewards.user_id = redeem_reward.user_id;
    
    IF current_bal IS NULL OR current_bal < amount_to_spend THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient points');
    END IF;

    -- 1. Deduct Points (Transaction Ledger)
    INSERT INTO public.reward_transactions (user_id, amount, transaction_type, description)
    VALUES (user_id, -amount_to_spend, 'SPEND_REWARD', 'Redeemed: ' || reward_type);

    -- 2. Create Redemption Request (For Admin Action)
    INSERT INTO public.redemption_requests (user_id, reward_type, points_spent)
    VALUES (user_id, reward_type, amount_to_spend);

    RETURN jsonb_build_object('success', true, 'message', 'Reward Redeemed! Admin notified.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. AUDIT LOGGING FOR ADMIN ACTIONS
CREATE TABLE IF NOT EXISTS public.reward_admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) NOT NULL,
    action TEXT NOT NULL, -- 'FULFILLED', 'REJECTED'
    redemption_id UUID REFERENCES public.redemption_requests(id) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reward_admin_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
DROP POLICY IF EXISTS "Admins view logs" ON public.reward_admin_logs;
CREATE POLICY "Admins view logs" ON public.reward_admin_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 3. TRIGGER TO LOG ADMIN ACTIONS
CREATE OR REPLACE FUNCTION log_redemption_action()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status != OLD.status AND NEW.status IN ('fulfilled', 'rejected') THEN
        INSERT INTO public.reward_admin_logs (admin_id, action, redemption_id, notes)
        VALUES (auth.uid(), UPPER(NEW.status), NEW.id, NEW.admin_notes);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_redemption ON public.redemption_requests;
CREATE TRIGGER trigger_log_redemption
    AFTER UPDATE ON public.redemption_requests
    FOR EACH ROW
    EXECUTE FUNCTION log_redemption_action();

-- 4. PREVENT DUPLICATE REDEMPTIONS (Idempotency)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_redemption 
ON public.redemption_requests (user_id, reward_type) 
WHERE status = 'pending';

-- 5. UPDATE ADMIN PENDING TASKS VIEW (Add Redemption Requests)
DROP VIEW IF EXISTS public.admin_pending_tasks;

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
        'REWARD_REDEMPTION' as task_type, 
        id::text as reference_id,
        'Redeem Request: ' || reward_type || ' (' || points_spent || ' pts)' as description,
        created_at as urgency_timestamp,
        'medium' as priority
    FROM public.redemption_requests
    WHERE status = 'pending';

ALTER VIEW public.admin_pending_tasks OWNER TO postgres;
GRANT SELECT ON public.admin_pending_tasks TO authenticated;

