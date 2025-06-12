-- Create job_alerts table
CREATE TABLE IF NOT EXISTS job_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    search_params JSONB NOT NULL,
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'instant')) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL,
    status TEXT CHECK (status IN ('applied', 'interviewing', 'offered', 'rejected', 'accepted')) NOT NULL,
    notes TEXT,
    next_steps TEXT,
    interview_date TIMESTAMP WITH TIME ZONE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_analytics table
CREATE TABLE IF NOT EXISTS job_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL,
    total_views INTEGER DEFAULT 0,
    unique_viewers INTEGER DEFAULT 0,
    applications INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    average_time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_views table
CREATE TABLE IF NOT EXISTS job_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_shares table
CREATE TABLE IF NOT EXISTS job_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT CHECK (platform IN ('linkedin', 'twitter', 'facebook')) NOT NULL,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_analytics_job_id ON job_analytics(job_id);
CREATE INDEX IF NOT EXISTS idx_job_views_job_id ON job_views(job_id);
CREATE INDEX IF NOT EXISTS idx_job_views_user_id ON job_views(user_id);
CREATE INDEX IF NOT EXISTS idx_job_shares_job_id ON job_shares(job_id);
CREATE INDEX IF NOT EXISTS idx_job_shares_user_id ON job_shares(user_id);

-- Create functions for analytics
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE job_analytics
    SET 
        total_views = total_views + 1,
        updated_at = NOW()
    WHERE job_id = $1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_job_shares(job_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE job_analytics
    SET 
        share_count = share_count + 1,
        updated_at = NOW()
    WHERE job_id = $1;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_shares ENABLE ROW LEVEL SECURITY;

-- Job alerts policies
CREATE POLICY "Users can view their own job alerts"
    ON job_alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job alerts"
    ON job_alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job alerts"
    ON job_alerts FOR UPDATE
    USING (auth.uid() = user_id);

-- Job applications policies
CREATE POLICY "Users can view their own job applications"
    ON job_applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job applications"
    ON job_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job applications"
    ON job_applications FOR UPDATE
    USING (auth.uid() = user_id);

-- Job analytics policies
CREATE POLICY "Anyone can view job analytics"
    ON job_analytics FOR SELECT
    USING (true);

-- Job views policies
CREATE POLICY "Anyone can create job views"
    ON job_views FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view their own job views"
    ON job_views FOR SELECT
    USING (auth.uid() = user_id);

-- Job shares policies
CREATE POLICY "Users can view their own job shares"
    ON job_shares FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job shares"
    ON job_shares FOR INSERT
    WITH CHECK (auth.uid() = user_id); 