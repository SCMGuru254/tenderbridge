-- Add image_url and document_url columns to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS document_url text;

-- Create salary_submissions table for salary insights feature
CREATE TABLE IF NOT EXISTS public.salary_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_title text NOT NULL,
  company_name text,
  location text,
  experience_level text,
  salary_amount numeric NOT NULL,
  salary_currency text DEFAULT 'KES',
  salary_period text DEFAULT 'monthly',
  bonus_amount numeric,
  benefits text[],
  is_anonymous boolean DEFAULT true,
  industry text DEFAULT 'Supply Chain',
  department text,
  years_experience integer,
  employment_type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on salary_submissions
ALTER TABLE public.salary_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for salary_submissions
CREATE POLICY "Anyone can view salary submissions" 
ON public.salary_submissions FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can submit salaries" 
ON public.salary_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" 
ON public.salary_submissions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" 
ON public.salary_submissions FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_salary_submissions_job_title ON public.salary_submissions(job_title);
CREATE INDEX IF NOT EXISTS idx_salary_submissions_location ON public.salary_submissions(location);
CREATE INDEX IF NOT EXISTS idx_salary_submissions_industry ON public.salary_submissions(industry);