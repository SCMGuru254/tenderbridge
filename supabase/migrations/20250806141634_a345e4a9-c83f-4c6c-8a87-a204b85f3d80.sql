-- Fix security warnings by adding search_path to functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.increment_vote_count(uuid) SET search_path = '';
ALTER FUNCTION public.initialize_user_points() SET search_path = '';
ALTER FUNCTION public.update_poll_vote_count() SET search_path = '';
ALTER FUNCTION public.award_points(uuid, integer, text, text, uuid) SET search_path = '';
ALTER FUNCTION public.process_redemption(uuid, uuid, jsonb) SET search_path = '';

-- Create database indexes for search performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_title_search ON jobs USING gin(to_tsvector('english', title));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_description_search ON jobs USING gin(to_tsvector('english', description));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_location ON jobs (location);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_job_type ON jobs (job_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_created_at ON jobs (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_id ON jobs (company_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_posted_by ON jobs (posted_by);

-- Scraped jobs indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_jobs_title_search ON scraped_jobs USING gin(to_tsvector('english', title));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_jobs_description_search ON scraped_jobs USING gin(to_tsvector('english', description));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_jobs_location ON scraped_jobs (location);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_jobs_company ON scraped_jobs (company);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_jobs_created_at ON scraped_jobs (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_jobs_category ON scraped_jobs (category);

-- Company indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_name_search ON companies USING gin(to_tsvector('english', name));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_location ON companies (location);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_verification_status ON companies (verification_status);

-- Profile indexes for search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_full_name_search ON profiles USING gin(to_tsvector('english', full_name));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_company_search ON profiles USING gin(to_tsvector('english', company));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role ON profiles (role);

-- Discussion indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discussions_title_search ON discussions USING gin(to_tsvector('english', title));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discussions_content_search ON discussions USING gin(to_tsvector('english', content));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discussions_created_at ON discussions (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discussions_author_id ON discussions (author_id);

-- Job application indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_job_applications_job_id ON job_applications (job_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_job_applications_applicant_id ON job_applications (applicant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_job_applications_status ON job_applications (status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_job_applications_created_at ON job_applications (created_at DESC);

-- Message indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_id ON messages (sender_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_recipient_id ON messages (recipient_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_read ON messages (read, recipient_id);

-- Mentorship indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mentors_user_id ON mentors (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mentors_expertise_areas ON mentors USING gin(expertise_areas);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mentors_is_active ON mentors (is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mentees_user_id ON mentees (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mentorship_sessions_mentor_id ON mentorship_sessions (mentor_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mentorship_sessions_mentee_id ON mentorship_sessions (mentee_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mentorship_sessions_session_date ON mentorship_sessions (session_date DESC);

-- HR profile indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hr_profiles_user_id ON hr_profiles (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hr_profiles_specializations ON hr_profiles USING gin(specializations);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hr_profiles_is_verified ON hr_profiles (is_verified);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hr_profiles_availability_status ON hr_profiles (availability_status);

-- Blog and newsletter indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_author_id ON blog_posts (author_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_created_at ON blog_posts (created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING gin(tags);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers (email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers (active);

-- Affiliate and rewards indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliate_programs_user_id ON affiliate_programs (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliate_programs_affiliate_code ON affiliate_programs (affiliate_code);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON affiliate_referrals (affiliate_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rewards_points_user_id ON rewards_points (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rewards_transactions_user_id ON rewards_transactions (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rewards_transactions_created_at ON rewards_transactions (created_at DESC);

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_active_created ON jobs (is_active, created_at DESC) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_jobs_recent ON scraped_jobs (created_at DESC) WHERE created_at > (now() - interval '30 days');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_reviews_company_rating ON company_reviews (company_id, rating DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_interview_reviews_company_rating ON interview_reviews (company_name, rating DESC);

-- Update extension versions to latest
UPDATE pg_extension SET extversion = (
  SELECT max(version) 
  FROM pg_available_extension_versions 
  WHERE name = pg_extension.extname
) WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- Enable password strength checking (handled at auth level)
-- This needs to be configured in Supabase dashboard under Auth settings