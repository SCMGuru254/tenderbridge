-- Create review_comments table
CREATE TABLE IF NOT EXISTS review_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID REFERENCES course_reviews(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    comment_text TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    parent_comment_id UUID REFERENCES review_comments(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns to review_comments if they don't exist
ALTER TABLE review_comments ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;
ALTER TABLE review_comments ADD COLUMN IF NOT EXISTS parent_comment_id UUID REFERENCES review_comments(id) ON DELETE CASCADE;
ALTER TABLE review_comments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Create review_helpful_votes table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID REFERENCES course_reviews(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(review_id, user_id)
);

-- Create job_skills table
CREATE TABLE IF NOT EXISTS job_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    skill_level TEXT,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create discussions table
CREATE TABLE IF NOT EXISTS discussions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    tags TEXT[],
    is_anonymous BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns to discussions if they don't exist
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general';
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_review_comments_review ON review_comments(review_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_parent ON review_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_job_skills_job ON job_skills(job_id);
CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON discussions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

-- Note: Policies will be created if they don't exist, otherwise will fail silently

-- Create all RLS policies after all tables are created
DO $policy$
BEGIN
    -- Review Comments Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'review_comments_select_active'
    ) THEN
        CREATE POLICY "review_comments_select_active"
            ON review_comments FOR SELECT
            TO public
            USING (status = 'active');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'review_comments_insert_own'
    ) THEN
        CREATE POLICY "review_comments_insert_own"
            ON review_comments FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'review_comments_update_own'
    ) THEN
        CREATE POLICY "review_comments_update_own"
            ON review_comments FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Review Helpful Votes Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'review_votes_select_all'
    ) THEN
        CREATE POLICY "review_votes_select_all"
            ON review_helpful_votes FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'review_votes_manage_own'
    ) THEN
        CREATE POLICY "review_votes_manage_own"
            ON review_helpful_votes FOR ALL
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Job Skills Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'job_skills_select_all'
    ) THEN
        CREATE POLICY "job_skills_select_all"
            ON job_skills FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'job_skills_manage_employer'
    ) THEN
        CREATE POLICY "job_skills_manage_employer"
            ON job_skills FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM jobs j
                    JOIN user_roles ur ON ur.user_id = auth.uid()
                    WHERE j.id = job_skills.job_id
                    AND ur.role = 'employer'
                )
            );
    END IF;

    -- Discussions Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'discussions_select_active'
    ) THEN
        CREATE POLICY "discussions_select_active"
            ON discussions FOR SELECT
            TO public
            USING (status = 'active');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'discussions_insert_own'
    ) THEN
        CREATE POLICY "discussions_insert_own"
            ON discussions FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'discussions_update_own'
    ) THEN
        CREATE POLICY "discussions_update_own"
            ON discussions FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END
$policy$;

-- Note: Triggers will be created if they don't exist, otherwise will fail silently

-- Update triggers with existence checks
DO $triggers$
BEGIN
    -- Create the trigger function if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.updated_at = timezone('utc'::text, now());
            RETURN NEW;
        END;
        $func$ language 'plpgsql';
    END IF;

    -- Create triggers if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_review_comments_updated_at'
        AND tgrelid = 'review_comments'::regclass
    ) THEN
        CREATE TRIGGER update_review_comments_updated_at
            BEFORE UPDATE ON review_comments
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_discussions_updated_at'
        AND tgrelid = 'discussions'::regclass
    ) THEN
        CREATE TRIGGER update_discussions_updated_at
            BEFORE UPDATE ON discussions
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END
$triggers$;