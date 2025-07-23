-- Missing tables for discussions interactions
CREATE TABLE public.discussion_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

CREATE TABLE public.discussion_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES discussion_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.discussion_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

CREATE TABLE public.discussion_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Missing company reviews table
CREATE TABLE public.company_reviews (
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
CREATE TABLE public.hr_profiles (
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

-- Missing rewards catalog table
CREATE TABLE public.rewards_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_redemptions_per_user INTEGER,
  total_available INTEGER,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Missing job bookmarks table  
CREATE TABLE public.job_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Missing document uploads table
CREATE TABLE public.document_uploads (
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

-- Enable RLS on all tables
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussion interactions
CREATE POLICY "Users can like discussions" ON public.discussion_likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view discussion likes" ON public.discussion_likes
FOR SELECT USING (true);

CREATE POLICY "Users can unlike discussions" ON public.discussion_likes
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can comment on discussions" ON public.discussion_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view discussion comments" ON public.discussion_comments
FOR SELECT USING (true);

CREATE POLICY "Users can update their own comments" ON public.discussion_comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can bookmark discussions" ON public.discussion_bookmarks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their bookmarks" ON public.discussion_bookmarks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks" ON public.discussion_bookmarks
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can share discussions" ON public.discussion_shares
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view share counts" ON public.discussion_shares
FOR SELECT USING (true);

-- RLS Policies for company reviews
CREATE POLICY "Users can create company reviews" ON public.company_reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view company reviews" ON public.company_reviews
FOR SELECT USING (true);

CREATE POLICY "Users can update their own reviews" ON public.company_reviews
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for HR profiles
CREATE POLICY "HR can create their profile" ON public.hr_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view HR profiles" ON public.hr_profiles
FOR SELECT USING (true);

CREATE POLICY "HR can update their profile" ON public.hr_profiles
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for rewards catalog
CREATE POLICY "Anyone can view rewards catalog" ON public.rewards_catalog
FOR SELECT USING (is_active = true);

-- RLS Policies for job bookmarks
CREATE POLICY "Users can bookmark jobs" ON public.job_bookmarks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their bookmarks" ON public.job_bookmarks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks" ON public.job_bookmarks
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for document uploads
CREATE POLICY "Users can upload documents" ON public.document_uploads
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their documents" ON public.document_uploads
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their documents" ON public.document_uploads
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their documents" ON public.document_uploads
FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_discussion_comments_updated_at
  BEFORE UPDATE ON public.discussion_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_company_reviews_updated_at
  BEFORE UPDATE ON public.company_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_hr_profiles_updated_at
  BEFORE UPDATE ON public.hr_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_rewards_catalog_updated_at
  BEFORE UPDATE ON public.rewards_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_document_uploads_updated_at
  BEFORE UPDATE ON public.document_uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();