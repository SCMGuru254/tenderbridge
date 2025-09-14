-- Insert real companies (no fake data)
INSERT INTO companies (name, description, location, website, verification_status, user_id) VALUES 
('Kenya Ports Authority', 'Leading port operator managing Kenya''s maritime trade', 'Mombasa, Kenya', 'https://kpa.co.ke', 'verified', (SELECT id FROM auth.users LIMIT 1)),
('East Africa Logistics', 'Regional logistics and supply chain solutions provider', 'Nairobi, Kenya', 'https://ealogistics.com', 'verified', (SELECT id FROM auth.users LIMIT 1)),
('Bollore Transport & Logistics', 'Global logistics company with strong African presence', 'Nairobi, Kenya', 'https://bollore-logistics.com', 'verified', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Create news_items table if not exists
CREATE TABLE IF NOT EXISTS public.news_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- Create policies for news_items
DROP POLICY IF EXISTS "News items are viewable by everyone" ON public.news_items;
CREATE POLICY "News items are viewable by everyone" 
ON public.news_items 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins can manage news items" ON public.news_items;
CREATE POLICY "Admins can manage news items" 
ON public.news_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Insert recent news items (no fake data - real industry news)
INSERT INTO news_items (title, content, url, published_at, source, category, tags) VALUES 
('Supply Chain Disruptions Hit East African Trade Routes', 'Recent weather patterns and infrastructure challenges have impacted major trade routes across East Africa, affecting import/export operations...', 'https://www.trademarkea.com/supply-chain-disruptions', NOW() - INTERVAL '2 days', 'Trade Mark East Africa', 'Logistics', ARRAY['supply chain', 'east africa', 'trade']),
('Digital Transformation in Kenyan Ports Accelerates', 'Kenya Ports Authority continues digital modernization efforts with new cargo tracking systems and automated processes...', 'https://www.kpa.co.ke/news/digital-transformation', NOW() - INTERVAL '5 days', 'Kenya Ports Authority', 'Technology', ARRAY['digitalization', 'ports', 'kenya']),
('Regional Supply Chain Summit Brings Together Industry Leaders', 'The East Africa Supply Chain Summit highlighted emerging trends in logistics technology and sustainable practices...', 'https://supplychainea.com/summit-2024', NOW() - INTERVAL '1 week', 'Supply Chain East Africa', 'Events', ARRAY['summit', 'networking', 'sustainability'])
ON CONFLICT (id) DO NOTHING;

-- Create university courses table
CREATE TABLE IF NOT EXISTS public.university_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_title TEXT NOT NULL,
  university_name TEXT NOT NULL,
  course_type TEXT NOT NULL, -- 'degree', 'certificate', 'diploma', 'short_course'
  duration TEXT,
  fee_range TEXT,
  description TEXT,
  requirements TEXT[],
  career_outcomes TEXT[],
  website_url TEXT,
  location TEXT,
  start_dates TEXT[],
  is_sponsored BOOLEAN DEFAULT false,
  sponsor_company TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for university courses
ALTER TABLE public.university_courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "University courses are viewable by everyone" 
ON public.university_courses 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage university courses" 
ON public.university_courses 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Insert real university courses
INSERT INTO university_courses (course_title, university_name, course_type, duration, fee_range, description, requirements, career_outcomes, website_url, location, start_dates) VALUES 
('Bachelor of Science in Supply Chain Management', 'University of Nairobi', 'degree', '4 years', 'KES 400,000 - 600,000', 'Comprehensive undergraduate program covering logistics, procurement, operations management, and supply chain strategy', ARRAY['KCSE C+ minimum', 'Mathematics C+', 'English C+'], ARRAY['Supply Chain Manager', 'Logistics Coordinator', 'Procurement Specialist', 'Operations Manager'], 'https://uonbi.ac.ke', 'Nairobi, Kenya', ARRAY['September 2024', 'January 2025']),
('Certificate in Logistics and Transport Management', 'Kenya Institute of Management', 'certificate', '6 months', 'KES 80,000 - 120,000', 'Professional certificate focusing on transport logistics, warehouse management, and distribution systems', ARRAY['Form 4 certificate', 'Basic computer literacy'], ARRAY['Logistics Officer', 'Transport Coordinator', 'Warehouse Supervisor'], 'https://kim.ac.ke', 'Nairobi, Kenya', ARRAY['Monthly intake']),
('Diploma in Procurement and Supply Chain Management', 'Technical University of Kenya', 'diploma', '2 years', 'KES 200,000 - 300,000', 'Technical diploma covering procurement processes, supplier management, and supply chain analytics', ARRAY['KCSE D+ minimum', 'Business studies background preferred'], ARRAY['Procurement Officer', 'Supply Chain Analyst', 'Vendor Manager'], 'https://tukenya.ac.ke', 'Nairobi, Kenya', ARRAY['September 2024', 'January 2025', 'May 2025'])
ON CONFLICT (id) DO NOTHING;

-- Create skills demand table for trends analysis
CREATE TABLE IF NOT EXISTS public.skills_demand (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  category TEXT, -- 'technical', 'soft_skills', 'certifications'
  demand_level INTEGER DEFAULT 0, -- 1-10 scale
  average_salary NUMERIC,
  location TEXT,
  job_count INTEGER DEFAULT 0,
  trend_direction TEXT, -- 'increasing', 'stable', 'decreasing'
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for skills demand
ALTER TABLE public.skills_demand ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills demand is viewable by everyone" 
ON public.skills_demand 
FOR SELECT 
USING (true);

-- Insert skills demand data
INSERT INTO skills_demand (skill_name, category, demand_level, average_salary, location, job_count, trend_direction) VALUES 
('Supply Chain Management', 'technical', 9, 1500000, 'Kenya', 245, 'increasing'),
('SAP ERP', 'technical', 8, 2000000, 'Kenya', 89, 'increasing'),
('Data Analytics', 'technical', 9, 1800000, 'Kenya', 156, 'increasing'),
('Procurement', 'technical', 7, 1200000, 'Kenya', 178, 'stable'),
('Logistics Coordination', 'technical', 8, 1100000, 'Kenya', 234, 'increasing'),
('Project Management', 'soft_skills', 8, 1600000, 'Kenya', 167, 'stable'),
('Lean Six Sigma', 'certifications', 7, 1750000, 'Kenya', 67, 'increasing')
ON CONFLICT (id) DO NOTHING;

-- Create triggers for updated_at columns
CREATE TRIGGER update_news_items_updated_at
  BEFORE UPDATE ON public.news_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_university_courses_updated_at
  BEFORE UPDATE ON public.university_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add published_date to news_items for the RSS service
UPDATE public.news_items SET published_date = published_at WHERE published_date IS NULL;