-- =====================================================
-- JOB ALERTS TABLE & IMPLEMENTATION
-- =====================================================

-- Create job_alerts table for real alert functionality
CREATE TABLE IF NOT EXISTS public.job_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT 'My Job Alert',
    keywords TEXT[] DEFAULT '{}',
    location TEXT,
    job_type TEXT,
    experience_level TEXT,
    is_remote BOOLEAN DEFAULT false,
    frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('instant', 'daily', 'weekly')),
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_alerts
CREATE POLICY "Users can view own job alerts"
ON public.job_alerts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own job alerts"
ON public.job_alerts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job alerts"
ON public.job_alerts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job alerts"
ON public.job_alerts FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- INTERVIEW QUESTION COMMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.interview_question_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.interview_questions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interview_question_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Anyone can view question comments"
ON public.interview_question_comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.interview_question_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
ON public.interview_question_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON public.interview_question_comments FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- DATA RETENTION POLICY
-- =====================================================

-- Create data retention tracking table
CREATE TABLE IF NOT EXISTS public.data_retention_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    records_deleted INTEGER DEFAULT 0,
    retention_days INTEGER NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (admin only)
ALTER TABLE public.data_retention_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view retention logs"
ON public.data_retention_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::platform_role));

-- Function to clean old data (GDPR compliant - 2 year retention)
CREATE OR REPLACE FUNCTION public.execute_data_retention()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    retention_period INTERVAL := '730 days'; -- 2 years
    deleted_count INTEGER;
BEGIN
    -- Delete old scraped jobs (30 days for expired jobs)
    DELETE FROM public.scraped_jobs 
    WHERE created_at < now() - INTERVAL '30 days'
    AND (expires_at IS NULL OR expires_at < now());
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    IF deleted_count > 0 THEN
        INSERT INTO public.data_retention_logs (table_name, records_deleted, retention_days)
        VALUES ('scraped_jobs', deleted_count, 30);
    END IF;

    -- Delete old notification logs (90 days)
    DELETE FROM public.notifications
    WHERE created_at < now() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    IF deleted_count > 0 THEN
        INSERT INTO public.data_retention_logs (table_name, records_deleted, retention_days)
        VALUES ('notifications', deleted_count, 90);
    END IF;

    -- Delete old session data from analytics (1 year)
    DELETE FROM public.profile_views
    WHERE viewed_at < now() - INTERVAL '365 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    IF deleted_count > 0 THEN
        INSERT INTO public.data_retention_logs (table_name, records_deleted, retention_days)
        VALUES ('profile_views', deleted_count, 365);
    END IF;
END;
$$;

-- =====================================================
-- COOKIE CONSENT TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cookie_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT, -- For anonymous users
    analytics_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    functional_consent BOOLEAN DEFAULT true, -- Always required
    consent_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address TEXT,
    user_agent TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own cookie consent"
ON public.cookie_consents FOR SELECT
USING (auth.uid() = user_id OR session_id = current_setting('request.headers', true)::json->>'x-session-id');

CREATE POLICY "Anyone can create cookie consent"
ON public.cookie_consents FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update own cookie consent"
ON public.cookie_consents FOR UPDATE
USING (auth.uid() = user_id);

-- Updated at trigger
CREATE TRIGGER update_job_alerts_updated_at
BEFORE UPDATE ON public.job_alerts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_question_comments_updated_at
BEFORE UPDATE ON public.interview_question_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_cookie_consents_updated_at
BEFORE UPDATE ON public.cookie_consents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();