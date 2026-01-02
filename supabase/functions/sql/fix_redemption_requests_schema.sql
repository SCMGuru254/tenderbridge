-- DIAGNOSTIC: Fix redemption_requests table schema
-- This adds the missing created_at column

DO $$
BEGIN
    -- Check if created_at column exists, if not add it
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'redemption_requests' 
        AND column_name = 'created_at'
    ) THEN
        RAISE NOTICE 'Adding created_at column to redemption_requests';
        ALTER TABLE public.redemption_requests 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
        RAISE NOTICE 'created_at column added successfully';
    ELSE
        RAISE NOTICE 'created_at column already exists';
    END IF;
END $$;

SELECT 'Schema fix complete' AS status;
