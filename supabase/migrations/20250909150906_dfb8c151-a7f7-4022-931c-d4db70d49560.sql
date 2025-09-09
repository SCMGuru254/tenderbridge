-- Create skills table for Hire My Skill
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create professional_profiles table
CREATE TABLE IF NOT EXISTS public.professional_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
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
  created_at timestamp with time zone NOT NULL DEFAULT now()
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
  created_at timestamp with time zone NOT NULL DEFAULT now()
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

-- RLS Policies for skills (public read, admin write)
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create skills" ON public.skills FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for professional_profiles
CREATE POLICY "Anyone can view professional profiles" ON public.professional_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile" ON public.professional_profiles FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for professional_skills
CREATE POLICY "Anyone can view professional skills" ON public.professional_skills FOR SELECT USING (true);
CREATE POLICY "Profile owners can manage their skills" ON public.professional_skills FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM public.professional_profiles WHERE id = profile_id)
);

-- RLS Policies for projects
CREATE POLICY "Anyone can view open projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Clients can manage their projects" ON public.projects FOR ALL USING (auth.uid() = client_id);

-- RLS Policies for project_skills
CREATE POLICY "Anyone can view project skills" ON public.project_skills FOR SELECT USING (true);
CREATE POLICY "Project owners can manage project skills" ON public.project_skills FOR ALL USING (
  auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
);

-- RLS Policies for project_proposals
CREATE POLICY "Anyone can view proposals" ON public.project_proposals FOR SELECT USING (true);
CREATE POLICY "Professionals can create proposals" ON public.project_proposals FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.professional_profiles WHERE id = professional_id)
);
CREATE POLICY "Professionals can update their proposals" ON public.project_proposals FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM public.professional_profiles WHERE id = professional_id)
);

-- RLS Policies for project_contracts
CREATE POLICY "Contract parties can view contracts" ON public.project_contracts FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM public.professional_profiles WHERE id = professional_id)
);
CREATE POLICY "Clients can manage contracts" ON public.project_contracts FOR ALL USING (auth.uid() = client_id);

-- RLS Policies for project_reviews
CREATE POLICY "Anyone can view reviews" ON public.project_reviews FOR SELECT USING (true);
CREATE POLICY "Contract parties can create reviews" ON public.project_reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND 
  EXISTS (
    SELECT 1 FROM public.project_contracts 
    WHERE id = contract_id AND (client_id = auth.uid() OR professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    ))
  )
);

-- Add foreign key constraints
ALTER TABLE public.professional_skills 
ADD CONSTRAINT fk_professional_skills_profile 
FOREIGN KEY (profile_id) REFERENCES public.professional_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.professional_skills 
ADD CONSTRAINT fk_professional_skills_skill 
FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;

ALTER TABLE public.project_skills 
ADD CONSTRAINT fk_project_skills_project 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE public.project_skills 
ADD CONSTRAINT fk_project_skills_skill 
FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;

ALTER TABLE public.project_proposals 
ADD CONSTRAINT fk_project_proposals_project 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE public.project_proposals 
ADD CONSTRAINT fk_project_proposals_professional 
FOREIGN KEY (professional_id) REFERENCES public.professional_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.project_contracts 
ADD CONSTRAINT fk_project_contracts_project 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE public.project_contracts 
ADD CONSTRAINT fk_project_contracts_proposal 
FOREIGN KEY (proposal_id) REFERENCES public.project_proposals(id) ON DELETE CASCADE;

ALTER TABLE public.project_contracts 
ADD CONSTRAINT fk_project_contracts_professional 
FOREIGN KEY (professional_id) REFERENCES public.professional_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.project_reviews 
ADD CONSTRAINT fk_project_reviews_contract 
FOREIGN KEY (contract_id) REFERENCES public.project_contracts(id) ON DELETE CASCADE;

-- Add triggers for updated_at
CREATE TRIGGER update_professional_profiles_updated_at
  BEFORE UPDATE ON public.professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_proposals_updated_at
  BEFORE UPDATE ON public.project_proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_contracts_updated_at
  BEFORE UPDATE ON public.project_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample skills
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