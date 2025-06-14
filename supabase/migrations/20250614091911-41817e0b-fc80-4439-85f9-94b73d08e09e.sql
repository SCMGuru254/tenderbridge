
-- Create career_applications table
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_name TEXT,
    applicant_email TEXT,
    proposal_text TEXT,
    user_id UUID REFERENCES auth.users(id),
    votes_count INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view career applications" ON public.career_applications
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create career applications" ON public.career_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own applications" ON public.career_applications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create career_application_votes table
CREATE TABLE IF NOT EXISTS public.career_application_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES career_applications(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(application_id, voter_id)
);

-- Enable RLS for votes
ALTER TABLE public.career_application_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all votes" ON public.career_application_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can vote once per application" ON public.career_application_votes
    FOR INSERT WITH CHECK (auth.uid() = voter_id);

-- Create function to increment vote count
CREATE OR REPLACE FUNCTION public.increment_vote_count(application_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE career_applications 
    SET votes_count = votes_count + 1 
    WHERE id = application_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
