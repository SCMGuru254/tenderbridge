
-- Create mentorship tables
CREATE TABLE public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  availability_hours INTEGER DEFAULT 5,
  hourly_rate DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.mentees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  career_goals TEXT,
  current_level TEXT NOT NULL,
  areas_of_interest TEXT[] DEFAULT '{}',
  preferred_session_type TEXT DEFAULT 'video',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.mentorship_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES mentors(id) NOT NULL,
  mentee_id UUID REFERENCES mentees(id) NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team applications table
CREATE TABLE public.team_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position_applied TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  portfolio_url TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  skills TEXT[] DEFAULT '{}',
  availability TEXT DEFAULT 'immediate',
  salary_expectation TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create interview sessions tables
CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'paused')),
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.interview_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES interview_sessions(id) NOT NULL,
  question TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  ai_feedback TEXT,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;

-- Mentor policies
CREATE POLICY "Users can create their mentor profile" ON public.mentors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their mentor profile" ON public.mentors FOR SELECT USING (auth.uid() = user_id OR true);
CREATE POLICY "Users can update their mentor profile" ON public.mentors FOR UPDATE USING (auth.uid() = user_id);

-- Mentee policies
CREATE POLICY "Users can create their mentee profile" ON public.mentees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their mentee profile" ON public.mentees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their mentee profile" ON public.mentees FOR UPDATE USING (auth.uid() = user_id);

-- Session policies
CREATE POLICY "Users can view their sessions" ON public.mentorship_sessions FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM mentors WHERE id = mentor_id
    UNION
    SELECT user_id FROM mentees WHERE id = mentee_id
  )
);

-- Team application policies
CREATE POLICY "Anyone can create team applications" ON public.team_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their applications" ON public.team_applications FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Interview session policies
CREATE POLICY "Users can manage their interview sessions" ON public.interview_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their interview responses" ON public.interview_responses FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM interview_sessions WHERE id = session_id)
);
