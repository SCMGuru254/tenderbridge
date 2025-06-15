
-- Create follows table for candidate following
CREATE TABLE public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Add RLS policies for follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view follows" 
ON public.follows FOR SELECT 
USING (true);

CREATE POLICY "Users can follow others" 
ON public.follows FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" 
ON public.follows FOR DELETE 
USING (auth.uid() = follower_id);

-- Add tagline and previous_job to profiles table
ALTER TABLE public.profiles 
ADD COLUMN tagline TEXT,
ADD COLUMN previous_job TEXT;

-- Create polls table
CREATE TABLE public.polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create poll_options table
CREATE TABLE public.poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_votes table
CREATE TABLE public.poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Add RLS policies for polls
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Poll policies
CREATE POLICY "Anyone can view polls" 
ON public.polls FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create polls" 
ON public.polls FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Poll options policies
CREATE POLICY "Anyone can view poll options" 
ON public.poll_options FOR SELECT 
USING (true);

CREATE POLICY "Poll creators can add options" 
ON public.poll_options FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM polls 
  WHERE id = poll_id AND created_by = auth.uid()
));

-- Poll votes policies
CREATE POLICY "Anyone can view poll votes" 
ON public.poll_votes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can vote" 
ON public.poll_votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their votes" 
ON public.poll_votes FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to update poll option vote counts
CREATE OR REPLACE FUNCTION update_poll_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poll_options 
    SET votes_count = votes_count + 1 
    WHERE id = NEW.option_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poll_options 
    SET votes_count = votes_count - 1 
    WHERE id = OLD.option_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE poll_options 
    SET votes_count = votes_count - 1 
    WHERE id = OLD.option_id;
    UPDATE poll_options 
    SET votes_count = votes_count + 1 
    WHERE id = NEW.option_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for vote count updates
CREATE TRIGGER update_poll_vote_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON poll_votes
  FOR EACH ROW EXECUTE FUNCTION update_poll_vote_count();

-- Add indexes for better performance
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_polls_discussion ON polls(discussion_id);
CREATE INDEX idx_poll_options_poll ON poll_options(poll_id);
CREATE INDEX idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX idx_poll_votes_user ON poll_votes(user_id);
