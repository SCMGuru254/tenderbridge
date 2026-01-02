-- 1. User Rewards Balance (The Wallet)
CREATE TABLE IF NOT EXISTS public.user_rewards (
    user_id UUID REFERENCES auth.users(id) NOT NULL PRIMARY KEY,
    current_points INTEGER DEFAULT 0 CHECK (current_points >= 0),
    lifetime_earned INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Reward Transactions (The Ledger)
CREATE TABLE IF NOT EXISTS public.reward_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount INTEGER NOT NULL, -- Positive for earning, Negative for spending
    transaction_type TEXT NOT NULL, -- 'EARN_LOGIN', 'EARN_JOB_APP', 'SPEND_CV_REVIEW', etc.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENABLE RLS
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES
DROP POLICY IF EXISTS "Users view own rewards" ON public.user_rewards;
CREATE POLICY "Users view own rewards" ON public.user_rewards FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own transactions" ON public.reward_transactions;
CREATE POLICY "Users view own transactions" ON public.reward_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 5. AUTOMATED BALANCE UPDATE TRIGGER
CREATE OR REPLACE FUNCTION update_reward_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Ensure Wallet Exists
    INSERT INTO public.user_rewards (user_id) VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;

    -- 2. Update Balance
    UPDATE public.user_rewards
    SET 
        current_points = current_points + NEW.amount,
        lifetime_earned = CASE WHEN NEW.amount > 0 THEN lifetime_earned + NEW.amount ELSE lifetime_earned END,
        updated_at = now()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_balance ON public.reward_transactions;
CREATE TRIGGER trigger_update_balance
    AFTER INSERT ON public.reward_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_reward_balance();

-- 6. REDEMPTION REQUESTS (To Audit Fulfillment)
CREATE TABLE IF NOT EXISTS public.redemption_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    reward_type TEXT NOT NULL, -- 'CV_REVIEW', 'PROFILE_HIGHLIGHT'
    points_spent INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'fulfilled', 'rejected'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.redemption_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own redemptions" ON public.redemption_requests;
CREATE POLICY "Users view own redemptions" ON public.redemption_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 6b. RPC FUNCTION TO SPEND POINTS (Transaction Wrapper)
CREATE OR REPLACE FUNCTION redeem_reward(amount_to_spend INTEGER, reward_type TEXT)
RETURNS JSONB AS $$
DECLARE
    current_bal INTEGER;
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
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


-- 7. JOB APPLICATION REWARD (+10 PTS)
CREATE OR REPLACE FUNCTION award_job_app_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Only award if user is authenticated (should be, but safe check)
    IF NEW.applicant_id IS NOT NULL THEN
        INSERT INTO public.reward_transactions (user_id, amount, transaction_type, description)
        VALUES (NEW.applicant_id, 10, 'EARN_JOB_APP', 'Job Application Points');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_award_job_app ON public.job_applications;
CREATE TRIGGER trigger_award_job_app
    AFTER INSERT ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION award_job_app_points();

-- 8. DAILY LOGIN REWARD (+5 PTS)
-- Logic: Frontend calls this RPC once on session init. 
-- DB checks if 'EARN_LOGIN' exists for today. If not, award.
CREATE OR REPLACE FUNCTION award_daily_login()
RETURNS JSONB AS $$
DECLARE
    curr_user_id UUID;
    already_awarded BOOLEAN;
BEGIN
    curr_user_id := auth.uid();
    IF curr_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Not authenticated');
    END IF;

    -- Check if awarded today
    SELECT EXISTS (
        SELECT 1 FROM public.reward_transactions
        WHERE user_id = curr_user_id
        AND transaction_type = 'EARN_LOGIN'
        AND created_at > CURRENT_DATE::timestamp
    ) INTO already_awarded;

    IF NOT already_awarded THEN
        INSERT INTO public.reward_transactions (user_id, amount, transaction_type, description)
        VALUES (curr_user_id, 5, 'EARN_LOGIN', 'Daily Login Bonus');
        RETURN jsonb_build_object('success', true, 'message', 'Login points awarded');
    END IF;

    RETURN jsonb_build_object('success', false, 'message', 'Already awarded today');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

