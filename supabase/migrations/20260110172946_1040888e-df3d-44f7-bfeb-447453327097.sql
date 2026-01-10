-- ============================================================
-- FIX REMAINING SECURITY DEFINER VIEWS
-- ============================================================

-- 1. Fix admin_affiliate_stats view
DROP VIEW IF EXISTS public.admin_affiliate_stats;
CREATE VIEW public.admin_affiliate_stats
WITH (security_invoker = true)
AS
SELECT 
    ap.user_id,
    ap.affiliate_code,
    ap.tier,
    COUNT(ar.id) FILTER (WHERE ar.referral_status = 'signed_up') AS total_signups,
    COUNT(ar.id) FILTER (WHERE ar.referral_status = 'converted_paid') AS total_sales,
    SUM(ar.commission_earned) AS total_commission_owed
FROM public.affiliate_programs ap
LEFT JOIN public.affiliate_referrals ar ON ap.id = ar.affiliate_id
GROUP BY ap.id, ap.user_id, ap.affiliate_code, ap.tier;

-- 2. Fix admin_pending_tasks view
DROP VIEW IF EXISTS public.admin_pending_tasks;
CREATE VIEW public.admin_pending_tasks
WITH (security_invoker = true)
AS
SELECT 
    'COURSE_APPROVAL'::text AS task_type,
    courses.id::text AS reference_id,
    ('Approve Course: ' || courses.title) AS description,
    courses.created_at AS urgency_timestamp,
    CASE WHEN courses.status = 'pending' THEN 'HIGH' ELSE 'medium' END AS priority
FROM public.courses
WHERE courses.status IN ('pending', 'pending_approval')

UNION ALL

SELECT 
    'MANUAL_VERIFICATION'::text AS task_type,
    manual_payment_claims.id::text AS reference_id,
    ('Verify M-Pesa: ' || manual_payment_claims.mpesa_code || ' from ' || COALESCE(manual_payment_claims.sender_name, 'Unknown') || ' (KES ' || manual_payment_claims.amount || ')') AS description,
    manual_payment_claims.created_at AS urgency_timestamp,
    'HIGH'::text AS priority
FROM public.manual_payment_claims
WHERE manual_payment_claims.status = 'pending_verification'

UNION ALL

SELECT 
    'PAYOUT_REQUEST'::text AS task_type,
    affiliate_programs.user_id::text AS reference_id,
    ('Payout Due: ' || affiliate_programs.affiliate_code || ' (KES ' || affiliate_programs.pending_payouts || ')') AS description,
    affiliate_programs.updated_at AS urgency_timestamp,
    'HIGH'::text AS priority
FROM public.affiliate_programs
WHERE affiliate_programs.pending_payouts >= 1000

UNION ALL

SELECT 
    'REWARD_REDEMPTION'::text AS task_type,
    redemption_requests.id::text AS reference_id,
    ('Redeem Request: ' || redemption_requests.reward_type || ' (' || redemption_requests.points_spent || ' pts)') AS description,
    redemption_requests.created_at AS urgency_timestamp,
    'medium'::text AS priority
FROM public.redemption_requests
WHERE redemption_requests.status = 'pending';

-- 3. Fix admin_affiliate_overview (was created with SECURITY INVOKER in previous migration but need to verify)
DROP VIEW IF EXISTS public.admin_affiliate_overview;
CREATE VIEW public.admin_affiliate_overview 
WITH (security_invoker = true)
AS
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