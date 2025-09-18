-- Create mentors table for mentorship program
CREATE TABLE IF NOT EXISTS public.mentors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  expertise_areas text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0,
  bio text,
  availability_hours integer NOT NULL DEFAULT 5,
  hourly_rate numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  rating numeric DEFAULT 0,
  total_sessions integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create mentees table for mentorship program
CREATE TABLE IF NOT EXISTS public.mentees (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  career_goals text,
  current_level text DEFAULT 'junior',
  areas_of_interest text[] DEFAULT '{}',
  preferred_session_type text DEFAULT 'video',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create skill_polls table for trending skills polling
CREATE TABLE IF NOT EXISTS public.skill_polls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name text NOT NULL,
  employer_id uuid NOT NULL,
  demand_level text NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  poll_type text NOT NULL DEFAULT 'demand', -- demand, trending, forecast
  description text,
  budget_range text,
  urgency_days integer DEFAULT 30,
  votes_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '30 days')
);

-- Create skill_poll_votes for tracking user votes on skills
CREATE TABLE IF NOT EXISTS public.skill_poll_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id uuid NOT NULL REFERENCES public.skill_polls(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  vote_type text NOT NULL DEFAULT 'interested', -- interested, not_interested, available
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Create review_likes for company review interactions
CREATE TABLE IF NOT EXISTS public.review_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id uuid NOT NULL REFERENCES public.company_reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  liked boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Create review_comments for company review discussions
CREATE TABLE IF NOT EXISTS public.review_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id uuid NOT NULL REFERENCES public.company_reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  comment_text text NOT NULL,
  parent_comment_id uuid REFERENCES public.review_comments(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentors
CREATE POLICY "Anyone can view mentors" ON public.mentors FOR SELECT USING (true);
CREATE POLICY "Users can create their own mentor profile" ON public.mentors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mentor profile" ON public.mentors FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for mentees  
CREATE POLICY "Users can manage their own mentee profile" ON public.mentees FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for skill polls
CREATE POLICY "Anyone can view skill polls" ON public.skill_polls FOR SELECT USING (true);
CREATE POLICY "Employers can create skill polls" ON public.skill_polls FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update their skill polls" ON public.skill_polls FOR UPDATE USING (auth.uid() = employer_id);

-- RLS Policies for skill poll votes
CREATE POLICY "Anyone can view poll votes" ON public.skill_poll_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on polls" ON public.skill_poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their votes" ON public.skill_poll_votes FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for review likes
CREATE POLICY "Anyone can view review likes" ON public.review_likes FOR SELECT USING (true);
CREATE POLICY "Users can like reviews" ON public.review_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their likes" ON public.review_likes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove their likes" ON public.review_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for review comments
CREATE POLICY "Anyone can view review comments" ON public.review_comments FOR SELECT USING (true);
CREATE POLICY "Users can comment on reviews" ON public.review_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their comments" ON public.review_comments FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_mentees_updated_at
  BEFORE UPDATE ON public.mentees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_skill_polls_updated_at
  BEFORE UPDATE ON public.skill_polls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_review_comments_updated_at
  BEFORE UPDATE ON public.review_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update skill poll votes count trigger
CREATE OR REPLACE FUNCTION public.update_skill_poll_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.skill_polls 
    SET votes_count = votes_count + 1 
    WHERE id = NEW.poll_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.skill_polls 
    SET votes_count = votes_count - 1 
    WHERE id = OLD.poll_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skill_poll_votes_count_trigger
  AFTER INSERT OR DELETE ON public.skill_poll_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_skill_poll_votes_count();