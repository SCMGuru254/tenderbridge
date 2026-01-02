-- 1. ADS TABLE (The Inventory)
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL, 
    image_url TEXT NOT NULL, 
    target_url TEXT NOT NULL, 
    position TEXT NOT NULL, -- 'header', 'sidebar', 'content'
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'expired'
    
    -- Analytics
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    
    -- Schedule
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ends_at TIMESTAMP WITH TIME ZONE, -- If NULL, runs indefinitely
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ENABLE RLS
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES
-- A) Public can ONLY view ads that are 'active' AND not expired
DROP POLICY IF EXISTS "Public can view active ads" ON public.ads;
CREATE POLICY "Public can view active ads" ON public.ads FOR SELECT USING (
    status = 'active' 
    AND (ends_at IS NULL OR ends_at > timezone('utc'::text, now()))
);

-- B) Only Admins can INSERT, UPDATE, DELETE (Full Control)
-- This ensures ONLY admins paid by clients can manage this inventory.
DROP POLICY IF EXISTS "Admins manage ads" ON public.ads;
CREATE POLICY "Admins manage ads" ON public.ads FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 4. AD VIEW TRACKING (RPC)
CREATE OR REPLACE FUNCTION record_ad_view(ad_id UUID)
RETURNS JSONB AS $$
DECLARE
    viewer_id UUID;
    today_views INTEGER;
BEGIN
    viewer_id := auth.uid();
    
    -- A. Increment Ad Stats (Always)
    UPDATE public.ads SET views_count = views_count + 1 WHERE id = ad_id;
    
    -- B. Award Points (If User Logged In)
    IF viewer_id IS NOT NULL THEN
        -- Check daily limit (Anti-Fraud: Max 10 ad points per day)
        SELECT COUNT(*) INTO today_views 
        FROM public.reward_transactions 
        WHERE user_id = viewer_id 
        AND transaction_type = 'EARN_AD_VIEW'
        AND created_at > timezone('utc'::text, now() - INTERVAL '24 hours');
        
        IF today_views < 10 THEN
            INSERT INTO public.reward_transactions (user_id, amount, transaction_type, description)
            VALUES (viewer_id, 1, 'EARN_AD_VIEW', 'Viewed Ad');
            
            RETURN jsonb_build_object('success', true, 'points_awarded', true);
        END IF;
    END IF;

    RETURN jsonb_build_object('success', true, 'points_awarded', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- NOTE: Seed Data removed as per request. 
-- You can add your own ads via the Admin Dashboard (coming next) or by INSERT checks.
