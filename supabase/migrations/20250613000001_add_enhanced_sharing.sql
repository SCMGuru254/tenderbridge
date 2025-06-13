-- Add enhanced sharing and analytics features

-- Create job_referrals table
CREATE TABLE public.job_referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referral_code TEXT NOT NULL UNIQUE,
    referral_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'hired', 'expired')),
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create share_templates table
CREATE TABLE public.share_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    platform TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    performance_score FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create success_stories table
CREATE TABLE public.success_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
    tags TEXT[] DEFAULT '{}',
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sharing_analytics table
CREATE TABLE public.sharing_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_id UUID REFERENCES public.job_referrals(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.share_templates(id) ON DELETE SET NULL,
    story_id UUID REFERENCES public.success_stories(id) ON DELETE SET NULL,
    platform TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    applications INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_referrals_job ON public.job_referrals(job_id);
CREATE INDEX idx_referrals_referrer ON public.job_referrals(referrer_id);
CREATE INDEX idx_referrals_status ON public.job_referrals(status);
CREATE INDEX idx_referrals_expires ON public.job_referrals(expires_at);
CREATE INDEX idx_templates_user ON public.share_templates(user_id);
CREATE INDEX idx_templates_platform ON public.share_templates(platform);
CREATE INDEX idx_stories_user ON public.success_stories(user_id);
CREATE INDEX idx_stories_status ON public.success_stories(status);
CREATE INDEX idx_analytics_referral ON public.sharing_analytics(referral_id);
CREATE INDEX idx_analytics_platform ON public.sharing_analytics(platform);

-- Enable Row Level Security
ALTER TABLE public.job_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sharing_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_referrals
CREATE POLICY "Users can view their referrals" ON public.job_referrals
    FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals" ON public.job_referrals
    FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- RLS Policies for share_templates
CREATE POLICY "Users can view templates" ON public.share_templates
    FOR SELECT USING (is_default OR auth.uid() = user_id);

CREATE POLICY "Users can manage their templates" ON public.share_templates
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for success_stories
CREATE POLICY "Users can view published stories" ON public.success_stories
    FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can manage their stories" ON public.success_stories
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for sharing_analytics
CREATE POLICY "Users can view their analytics" ON public.sharing_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM job_referrals 
            WHERE id = referral_id AND referrer_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM share_templates 
            WHERE id = template_id AND user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM success_stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

-- Functions

-- Function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    code TEXT;
    exists_already BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 8-character code
        code := UPPER(SUBSTRING(MD5(''||NOW()::TEXT||RANDOM()::TEXT) FOR 8));
        
        -- Check if code already exists
        SELECT EXISTS (
            SELECT 1 FROM job_referrals WHERE referral_code = code
        ) INTO exists_already;
        
        -- Exit loop if unique code found
        EXIT WHEN NOT exists_already;
    END LOOP;
    
    RETURN code;
END;
$$;

-- Function to update sharing analytics
CREATE OR REPLACE FUNCTION update_sharing_analytics(
    p_referral_id UUID DEFAULT NULL,
    p_template_id UUID DEFAULT NULL,
    p_story_id UUID DEFAULT NULL,
    p_platform TEXT,
    p_clicks INTEGER DEFAULT 0,
    p_shares INTEGER DEFAULT 0,
    p_applications INTEGER DEFAULT 0,
    p_conversions INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.sharing_analytics (
        referral_id,
        template_id,
        story_id,
        platform,
        clicks,
        shares,
        applications,
        conversions
    )
    VALUES (
        p_referral_id,
        p_template_id,
        p_story_id,
        p_platform,
        p_clicks,
        p_shares,
        p_applications,
        p_conversions
    )
    ON CONFLICT (id) DO UPDATE
    SET
        clicks = sharing_analytics.clicks + p_clicks,
        shares = sharing_analytics.shares + p_shares,
        applications = sharing_analytics.applications + p_applications,
        conversions = sharing_analytics.conversions + p_conversions,
        updated_at = NOW();
END;
$$;

-- Function to calculate template performance score
CREATE OR REPLACE FUNCTION calculate_template_performance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Calculate performance score based on analytics
    WITH template_stats AS (
        SELECT
            template_id,
            SUM(clicks) as total_clicks,
            SUM(shares) as total_shares,
            SUM(applications) as total_applications,
            SUM(conversions) as total_conversions
        FROM sharing_analytics
        WHERE template_id IS NOT NULL
        GROUP BY template_id
    )
    UPDATE share_templates
    SET performance_score = (
        COALESCE(s.total_clicks, 0) * 0.2 +
        COALESCE(s.total_shares, 0) * 0.3 +
        COALESCE(s.total_applications, 0) * 0.2 +
        COALESCE(s.total_conversions, 0) * 0.3
    )
    FROM template_stats s
    WHERE share_templates.id = s.template_id;
    
    RETURN NULL;
END;
$$;

-- Create trigger for template performance updates
CREATE TRIGGER update_template_performance
AFTER INSERT OR UPDATE ON sharing_analytics
FOR EACH ROW
WHEN (NEW.template_id IS NOT NULL)
EXECUTE FUNCTION calculate_template_performance();
