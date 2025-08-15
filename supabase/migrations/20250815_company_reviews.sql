-- Create company reviews table
CREATE TABLE IF NOT EXISTS company_reviews (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT NOT NULL,
    review_text TEXT NOT NULL,
    pros TEXT,
    cons TEXT,
    position TEXT,
    employment_status TEXT CHECK (
        employment_status IN ('current', 'former', 'interview')
    ),
    employment_period TEXT,
    location TEXT,
    work_life_balance INTEGER CHECK (work_life_balance BETWEEN 1 AND 5),
    salary_benefits INTEGER CHECK (salary_benefits BETWEEN 1 AND 5),
    job_security INTEGER CHECK (job_security BETWEEN 1 AND 5),
    management INTEGER CHECK (management BETWEEN 1 AND 5),
    culture INTEGER CHECK (culture BETWEEN 1 AND 5),
    career_growth INTEGER CHECK (career_growth BETWEEN 1 AND 5),
    verified BOOLEAN DEFAULT false,
    anonymous BOOLEAN DEFAULT true,
    helpful_votes INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    review_status TEXT DEFAULT 'pending' CHECK (
        review_status IN ('pending', 'approved', 'rejected', 'flagged')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved reviews
CREATE POLICY "Everyone can read approved reviews" ON company_reviews
    FOR SELECT
    USING (status = 'approved');

-- Only authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" ON company_reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON company_reviews
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = reviewer_id);

-- Create helpful votes table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
    review_id UUID REFERENCES company_reviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (review_id, user_id)
);

-- Add RLS to helpful votes
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Users can vote on reviews
CREATE POLICY "Users can vote on reviews" ON review_helpful_votes
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Create review reports table
CREATE TABLE IF NOT EXISTS review_reports (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    review_id UUID REFERENCES company_reviews(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'resolved', 'dismissed')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Add RLS to reports
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports" ON review_reports
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

-- Update helpful votes trigger
CREATE OR REPLACE FUNCTION update_helpful_votes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE company_reviews
        SET helpful_votes = (
            SELECT COUNT(*)
            FROM review_helpful_votes
            WHERE review_id = NEW.review_id
            AND helpful = true
        )
        WHERE id = NEW.review_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE company_reviews
        SET helpful_votes = (
            SELECT COUNT(*)
            FROM review_helpful_votes
            WHERE review_id = OLD.review_id
            AND helpful = true
        )
        WHERE id = OLD.review_id;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER update_helpful_votes_trigger
AFTER INSERT OR UPDATE OR DELETE ON review_helpful_votes
FOR EACH ROW
EXECUTE FUNCTION update_helpful_votes();

-- Update reported count trigger
CREATE OR REPLACE FUNCTION update_reported_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE company_reviews
        SET 
            reported_count = reported_count + 1,
            status = CASE 
                WHEN reported_count + 1 >= 5 THEN 'flagged'
                ELSE status
            END
        WHERE id = NEW.review_id;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER update_reported_count_trigger
AFTER INSERT ON review_reports
FOR EACH ROW
EXECUTE FUNCTION update_reported_count();
