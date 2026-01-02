-- DIAGNOSTIC: Check if redemption_requests table exists and has correct schema
-- Run this BEFORE reward_security_hardening.sql

-- Check if table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'redemption_requests'
    ) THEN
        RAISE NOTICE 'redemption_requests table does NOT exist - creating it now';
        
        -- Create the table
        CREATE TABLE public.redemption_requests (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) NOT NULL,
            reward_type TEXT NOT NULL,
            points_spent INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            admin_notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
        
        ALTER TABLE public.redemption_requests ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users view own redemptions" ON public.redemption_requests 
            FOR SELECT TO authenticated USING (auth.uid() = user_id);
            
        RAISE NOTICE 'redemption_requests table created successfully';
    ELSE
        RAISE NOTICE 'redemption_requests table EXISTS';
        
        -- Check if reward_type column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'redemption_requests' 
            AND column_name = 'reward_type'
        ) THEN
            RAISE NOTICE 'reward_type column MISSING - adding it now';
            ALTER TABLE public.redemption_requests ADD COLUMN reward_type TEXT NOT NULL;
        ELSE
            RAISE NOTICE 'reward_type column EXISTS';
        END IF;
    END IF;
END $$;

SELECT 'Diagnostic complete - check the messages above' AS status;
