-- Fix security warnings by adding search_path to functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.increment_vote_count(uuid) SET search_path = '';
ALTER FUNCTION public.initialize_user_points() SET search_path = '';
ALTER FUNCTION public.update_poll_vote_count() SET search_path = '';
ALTER FUNCTION public.award_points(uuid, integer, text, text, uuid) SET search_path = '';
ALTER FUNCTION public.process_redemption(uuid, uuid, jsonb) SET search_path = '';

-- Create database indexes for search performance (without CONCURRENTLY)
CREATE INDEX IF NOT EXISTS idx_jobs_title_search ON jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_description_search ON jobs USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs (job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs (company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs (posted_by);

-- Scraped jobs indexes
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_title_search ON scraped_jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_description_search ON scraped_jobs USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_location ON scraped_jobs (location);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_company ON scraped_jobs (company);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_created_at ON scraped_jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_category ON scraped_jobs (category);

-- Company indexes
CREATE INDEX IF NOT EXISTS idx_companies_name_search ON companies USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies (location);
CREATE INDEX IF NOT EXISTS idx_companies_verification_status ON companies (verification_status);

-- Profile indexes for search
CREATE INDEX IF NOT EXISTS idx_profiles_full_name_search ON profiles USING gin(to_tsvector('english', full_name));
CREATE INDEX IF NOT EXISTS idx_profiles_company_search ON profiles USING gin(to_tsvector('english', company));
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);

-- Discussion indexes
CREATE INDEX IF NOT EXISTS idx_discussions_title_search ON discussions USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_discussions_content_search ON discussions USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_author_id ON discussions (author_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_jobs_active_created ON jobs (is_active, created_at DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_recent ON scraped_jobs (created_at DESC) WHERE created_at > (now() - interval '30 days');

-- Add pagination function for optimized job queries
CREATE OR REPLACE FUNCTION get_paginated_jobs(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_search_term TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_job_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  company_name TEXT,
  location TEXT,
  description TEXT,
  job_type TEXT,
  created_at TIMESTAMPTZ,
  total_count BIGINT
)
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.title,
    COALESCE(c.name, 'Company') as company_name,
    j.location,
    j.description,
    j.job_type::TEXT,
    j.created_at,
    COUNT(*) OVER() as total_count
  FROM jobs j
  LEFT JOIN companies c ON j.company_id = c.id
  WHERE 
    j.is_active = true
    AND (p_search_term IS NULL OR 
         to_tsvector('english', j.title || ' ' || j.description) @@ plainto_tsquery('english', p_search_term))
    AND (p_location IS NULL OR j.location ILIKE '%' || p_location || '%')
    AND (p_job_type IS NULL OR j.job_type::TEXT = p_job_type)
  ORDER BY j.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;