-- Create skills table for Hire My Skill with unique constraint
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create professional_profiles table
CREATE TABLE IF NOT EXISTS public.professional_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  hourly_rate numeric,
  availability text,
  experience_years integer,
  education text,
  certifications text[],
  portfolio_url text,
  linkedin_url text,
  github_url text,
  website_url text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create professional_skills table
CREATE TABLE IF NOT EXISTS public.professional_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  proficiency_level text NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(profile_id, skill_id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  budget_min numeric,
  budget_max numeric,
  duration_estimate text,
  requirements text[],
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create project_skills table
CREATE TABLE IF NOT EXISTS public.project_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  minimum_proficiency text NOT NULL CHECK (minimum_proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, skill_id)
);

-- Create project_proposals table
CREATE TABLE IF NOT EXISTS public.project_proposals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  professional_id uuid NOT NULL,
  cover_letter text NOT NULL,
  proposed_rate numeric NOT NULL,
  estimated_hours integer,
  availability_start timestamp with time zone,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create project_contracts table
CREATE TABLE IF NOT EXISTS public.project_contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  proposal_id uuid NOT NULL,
  professional_id uuid NOT NULL,
  client_id uuid NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  agreed_rate numeric NOT NULL,
  payment_terms text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'signed', 'active', 'completed', 'terminated')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create project_reviews table
CREATE TABLE IF NOT EXISTS public.project_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id uuid NOT NULL,
  reviewer_id uuid NOT NULL,
  reviewee_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  communication_rating integer CHECK (communication_rating >= 1 AND communication_rating <= 5),
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeliness_rating integer CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviews ENABLE ROW LEVEL SECURITY;

-- Add booking URLs to hr_profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hr_profiles' AND column_name='booking_calendly_url') THEN
    ALTER TABLE public.hr_profiles ADD COLUMN booking_calendly_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hr_profiles' AND column_name='booking_google_url') THEN  
    ALTER TABLE public.hr_profiles ADD COLUMN booking_google_url text;
  END IF;
END $$;

-- RLS Policies for skills (public read, authenticated write)
DROP POLICY IF EXISTS "Anyone can view skills" ON public.skills;
DROP POLICY IF EXISTS "Authenticated users can create skills" ON public.skills;
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create skills" ON public.skills FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for professional_profiles
DROP POLICY IF EXISTS "Anyone can view professional profiles" ON public.professional_profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.professional_profiles;
CREATE POLICY "Anyone can view professional profiles" ON public.professional_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile" ON public.professional_profiles FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for professional_skills
DROP POLICY IF EXISTS "Anyone can view professional skills" ON public.professional_skills;
DROP POLICY IF EXISTS "Profile owners can manage their skills" ON public.professional_skills;
CREATE POLICY "Anyone can view professional skills" ON public.professional_skills FOR SELECT USING (true);
CREATE POLICY "Profile owners can manage their skills" ON public.professional_skills FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM public.professional_profiles WHERE id = profile_id)
);

-- RLS Policies for projects
DROP POLICY IF EXISTS "Anyone can view open projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can manage their projects" ON public.projects;
CREATE POLICY "Anyone can view open projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Clients can manage their projects" ON public.projects FOR ALL USING (auth.uid() = client_id);

-- RLS Policies for project_skills
DROP POLICY IF EXISTS "Anyone can view project skills" ON public.project_skills;
DROP POLICY IF EXISTS "Project owners can manage project skills" ON public.project_skills;
CREATE POLICY "Anyone can view project skills" ON public.project_skills FOR SELECT USING (true);
CREATE POLICY "Project owners can manage project skills" ON public.project_skills FOR ALL USING (
  auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
);

-- RLS Policies for project_proposals
DROP POLICY IF EXISTS "Anyone can view proposals" ON public.project_proposals;
DROP POLICY IF EXISTS "Professionals can create proposals" ON public.project_proposals;
DROP POLICY IF EXISTS "Professionals can update their proposals" ON public.project_proposals;
CREATE POLICY "Anyone can view proposals" ON public.project_proposals FOR SELECT USING (true);
CREATE POLICY "Professionals can create proposals" ON public.project_proposals FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.professional_profiles WHERE id = professional_id)
);
CREATE POLICY "Professionals can update their proposals" ON public.project_proposals FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM public.professional_profiles WHERE id = professional_id)
);

-- RLS Policies for project_contracts
DROP POLICY IF EXISTS "Contract parties can view contracts" ON public.project_contracts;
DROP POLICY IF EXISTS "Clients can manage contracts" ON public.project_contracts;
CREATE POLICY "Contract parties can view contracts" ON public.project_contracts FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM public.professional_profiles WHERE id = professional_id)
);
CREATE POLICY "Clients can manage contracts" ON public.project_contracts FOR ALL USING (auth.uid() = client_id);

-- RLS Policies for project_reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.project_reviews;
DROP POLICY IF EXISTS "Contract parties can create reviews" ON public.project_reviews;
CREATE POLICY "Anyone can view reviews" ON public.project_reviews FOR SELECT USING (true);
CREATE POLICY "Contract parties can create reviews" ON public.project_reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id
);

-- Insert sample skills
INSERT INTO public.skills (name, category, description) VALUES
('Supply Chain Management', 'Supply Chain', 'End-to-end supply chain planning and optimization'),
('Procurement', 'Supply Chain', 'Strategic sourcing and procurement processes'),
('Logistics Coordination', 'Logistics', 'Transportation and warehouse management'),
('Inventory Management', 'Operations', 'Stock control and inventory optimization'),
('Demand Planning', 'Planning', 'Forecasting and demand management'),
('Vendor Management', 'Procurement', 'Supplier relationship and performance management'),
('Quality Control', 'Quality', 'Quality assurance and control processes'),
('Data Analytics', 'Technology', 'Data analysis and business intelligence'),
('Project Management', 'Management', 'Project planning and execution'),
('Risk Management', 'Risk', 'Supply chain risk assessment and mitigation'),
('Sustainability', 'Environment', 'Sustainable supply chain practices'),
('ERP Systems', 'Technology', 'Enterprise resource planning systems'),
('Lean Manufacturing', 'Operations', 'Lean process improvement methodologies'),
('Contract Negotiation', 'Legal', 'Commercial contract negotiation and management'),
('Cross-functional Collaboration', 'Soft Skills', 'Working effectively across departments')
ON CONFLICT (name) DO NOTHING;

-- Insert sample HR profiles
INSERT INTO public.hr_profiles (user_id, bio, years_experience, hourly_rate, services_offered, specializations, availability_status, certifications, languages_spoken, timezone, booking_calendly_url, booking_google_url) 
SELECT 
  profiles.id,
  'Experienced HR professional specializing in supply chain recruitment and talent management.',
  FLOOR(RANDOM() * 10) + 5,
  FLOOR(RANDOM() * 100) + 50,
  ARRAY['Recruitment', 'HR Consulting', 'Performance Management', 'Training & Development'],
  ARRAY['Supply Chain Recruitment', 'Executive Search', 'Talent Acquisition'],
  'available',
  ARRAY['SHRM-CP', 'PHR', 'SPHR'],
  ARRAY['English', 'Spanish'],
  'UTC',
  'https://calendly.com/hr-professional',
  'https://calendar.google.com/calendar/appointments'
FROM profiles 
WHERE profiles.role = 'hr' OR profiles.id IN (
  SELECT DISTINCT id FROM profiles LIMIT 3
)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample mentors
INSERT INTO public.mentors (user_id, bio, experience_years, expertise_areas, hourly_rate, availability_hours)
SELECT 
  profiles.id,
  'Supply chain mentor with extensive industry experience helping professionals advance their careers.',
  FLOOR(RANDOM() * 15) + 5,
  ARRAY['Supply Chain Strategy', 'Leadership Development', 'Career Guidance', 'Industry Insights'],
  FLOOR(RANDOM() * 80) + 40,
  FLOOR(RANDOM() * 20) + 5
FROM profiles 
LIMIT 5
ON CONFLICT (user_id) DO NOTHING;