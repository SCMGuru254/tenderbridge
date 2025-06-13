-- Enable the vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for job embeddings
CREATE TABLE IF NOT EXISTS job_embeddings (
    id UUID PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
    embedding vector(384), -- Using 384 dimensions for BERT embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for cached job matches
CREATE TABLE IF NOT EXISTS job_matches_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_embeddings_updated_at ON job_embeddings(updated_at);
CREATE INDEX IF NOT EXISTS idx_job_matches_cache_user_query ON job_matches_cache(user_id, query);
CREATE INDEX IF NOT EXISTS idx_job_matches_cache_expires ON job_matches_cache(expires_at);

-- Function to update job embeddings
CREATE OR REPLACE FUNCTION update_job_embedding()
RETURNS TRIGGER AS $$
BEGIN
    -- This would be called by the edge function that generates embeddings
    -- Just updating the timestamp for now
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update embeddings when job is updated
CREATE TRIGGER job_embedding_update
    BEFORE UPDATE ON job_embeddings
    FOR EACH ROW
    EXECUTE FUNCTION update_job_embedding();

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_matches()
RETURNS void AS $$
BEGIN
    DELETE FROM job_matches_cache
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired cache entries
SELECT cron.schedule(
    'cleanup-expired-matches',
    '0 */6 * * *', -- Run every 6 hours
    'SELECT cleanup_expired_matches()'
);

-- Function to find similar jobs using vector similarity
CREATE OR REPLACE FUNCTION find_similar_jobs(
    embedding vector(384),
    match_threshold FLOAT DEFAULT 0.7,
    max_results INT DEFAULT 10
)
RETURNS TABLE (
    job_id UUID,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        je.id as job_id,
        1 - (je.embedding <=> embedding) as similarity
    FROM job_embeddings je
    WHERE 1 - (je.embedding <=> embedding) > match_threshold
    ORDER BY je.embedding <=> embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;
