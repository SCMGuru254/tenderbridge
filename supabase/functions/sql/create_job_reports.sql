-- JOB REPORTS TABLE (Content Moderation)
-- NOTE: This table may already exist. This script adds missing columns/policies if needed.

-- Add columns if they don't exist
DO $$
BEGIN
    -- Check if report_reason column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_reports' AND column_name = 'report_reason') THEN
        ALTER TABLE public.job_reports ADD COLUMN report_reason TEXT;
    END IF;
    
    -- Check if admin_notes column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_reports' AND column_name = 'admin_notes') THEN
        ALTER TABLE public.job_reports ADD COLUMN admin_notes TEXT;
    END IF;
    
    -- Check if reviewed_by column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_reports' AND column_name = 'reviewed_by') THEN
        ALTER TABLE public.job_reports ADD COLUMN reviewed_by UUID REFERENCES auth.users(id);
    END IF;
    
    -- Check if reviewed_at column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_reports' AND column_name = 'reviewed_at') THEN
        ALTER TABLE public.job_reports ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE public.job_reports ENABLE ROW LEVEL SECURITY;

-- Policies (using reported_by instead of reporter_id to match existing schema)
-- Users can create reports
DROP POLICY IF EXISTS "Users can create reports" ON public.job_reports;
CREATE POLICY "Users can create reports" ON public.job_reports 
    FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = reported_by);

-- Users can view their own reports
DROP POLICY IF EXISTS "Users view own reports" ON public.job_reports;
CREATE POLICY "Users view own reports" ON public.job_reports 
    FOR SELECT TO authenticated 
    USING (auth.uid() = reported_by);

-- Admins can view all reports
DROP POLICY IF EXISTS "Admins view all reports" ON public.job_reports;
CREATE POLICY "Admins view all reports" ON public.job_reports 
    FOR SELECT TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Admins can update reports (review them)
DROP POLICY IF EXISTS "Admins update reports" ON public.job_reports;
CREATE POLICY "Admins update reports" ON public.job_reports 
    FOR UPDATE TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Prevent duplicate reports (same user reporting same job)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_job_report 
ON public.job_reports (job_id, reported_by) 
WHERE status = 'pending';

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_job_reports_status ON public.job_reports(status);
CREATE INDEX IF NOT EXISTS idx_job_reports_job_id ON public.job_reports(job_id);
