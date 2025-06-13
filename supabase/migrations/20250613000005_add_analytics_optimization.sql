-- Analytics and Optimization Tables

-- User behavior analytics
CREATE TABLE user_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    page_view TEXT NOT NULL,
    action_type TEXT NOT NULL,
    action_details JSONB,
    session_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Job interaction metrics
CREATE TABLE job_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    conversion_status TEXT,
    metadata JSONB
);

-- Social feature performance metrics
CREATE TABLE social_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_type TEXT NOT NULL,
    engagement_count INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    conversion_rate DECIMAL,
    time_period TSTZRANGE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- A/B testing configuration and results
CREATE TABLE ab_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_name TEXT NOT NULL,
    variant TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    configuration JSONB,
    results JSONB
);

-- User segments for targeted optimization
CREATE TABLE user_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_name TEXT NOT NULL,
    criteria JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB
);

-- Performance optimization metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type TEXT NOT NULL,
    value DECIMAL NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    component TEXT,
    metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_created_at ON user_analytics(created_at);
CREATE INDEX idx_job_analytics_job_id ON job_analytics(job_id);
CREATE INDEX idx_job_analytics_created_at ON job_analytics(created_at);
CREATE INDEX idx_social_analytics_feature_type ON social_analytics(feature_type);
CREATE INDEX idx_ab_tests_active ON ab_tests(is_active);

-- Functions and triggers for analytics
CREATE OR REPLACE FUNCTION update_social_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update social analytics when new social interactions occur
    INSERT INTO social_analytics (
        feature_type,
        engagement_count,
        unique_users,
        time_period,
        metadata
    )
    VALUES (
        NEW.feature_type,
        1,
        1,
        tstzrange(NOW(), NULL),
        jsonb_build_object('source', TG_TABLE_NAME)
    )
    ON CONFLICT (feature_type, time_period)
    DO UPDATE SET
        engagement_count = social_analytics.engagement_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for quick analytics access
CREATE MATERIALIZED VIEW analytics_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as day,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_interactions,
    action_type,
    page_view
FROM user_analytics
GROUP BY 1, 4, 5;

-- Create refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_summary;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_analytics_summary_trigger
AFTER INSERT OR UPDATE OR DELETE ON user_analytics
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_analytics_summary();
