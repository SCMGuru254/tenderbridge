-- Missing tables for discussions interactions
CREATE TABLE IF NOT EXISTS public.discussion_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.discussion_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES discussion_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.discussion_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.discussion_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Missing company reviews table
CREATE TABLE IF NOT EXISTS public.company_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  pros TEXT,
  cons TEXT,
  work_life_balance_rating INTEGER CHECK (work_life_balance_rating >= 1 AND work_life_balance_rating <= 5),
  management_rating INTEGER CHECK (management_rating >= 1 AND management_rating <= 5),
  culture_rating INTEGER CHECK (culture_rating >= 1 AND culture_rating <= 5),
  compensation_rating INTEGER CHECK (compensation_rating >= 1 AND compensation_rating <= 5),
  career_growth_rating INTEGER CHECK (career_growth_rating >= 1 AND career_growth_rating <= 5),
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_current_employee BOOLEAN NOT NULL DEFAULT true,
  job_position TEXT,
  employment_duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Missing HR profiles table
CREATE TABLE IF NOT EXISTS public.hr_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  services_offered TEXT[] NOT NULL DEFAULT '{}',
  specializations TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER NOT NULL DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  availability_status TEXT NOT NULL DEFAULT 'available',
  bio TEXT,
  certifications TEXT[] DEFAULT '{}',
  languages_spoken TEXT[] DEFAULT '{"English"}',
  preferred_contact_method TEXT DEFAULT 'email',
  timezone TEXT DEFAULT 'UTC',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_clients INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Missing job bookmarks table  
CREATE TABLE IF NOT EXISTS public.job_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Missing document uploads table
CREATE TABLE IF NOT EXISTS public.document_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'cv', 'cover_letter', 'portfolio', etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  upload_source TEXT DEFAULT 'file_upload', -- 'file_upload', 'copy_paste', 'url'
  extracted_text TEXT, -- For searchability
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discussion_likes') THEN
    ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discussion_comments') THEN
    ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discussion_bookmarks') THEN
    ALTER TABLE public.discussion_bookmarks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discussion_shares') THEN
    ALTER TABLE public.discussion_shares ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'company_reviews') THEN
    ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hr_profiles') THEN
    ALTER TABLE public.hr_profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'job_bookmarks') THEN
    ALTER TABLE public.job_bookmarks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_uploads') THEN
    ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;