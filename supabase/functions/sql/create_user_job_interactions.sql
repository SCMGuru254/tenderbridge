
-- Create saved_jobs table for user favorites
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    -- We support both internal and scraped jobs. 
    -- Constraint: At least one ID must be present.
    job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
    scraped_job_id uuid REFERENCES public.scraped_jobs(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT one_job_reference_required CHECK (job_id IS NOT NULL OR scraped_job_id IS NOT NULL),
    -- Prevent duplicate saves
    UNIQUE(user_id, job_id),
    UNIQUE(user_id, scraped_job_id)
);

-- Create job_application_tracker for users to manually track their ext. applications
CREATE TABLE IF NOT EXISTS public.job_application_tracker (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
    scraped_job_id uuid REFERENCES public.scraped_jobs(id) ON DELETE CASCADE,
    status text DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'offer', 'rejected')),
    notes text,
    applied_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT one_job_reference_required_tracker CHECK (job_id IS NOT NULL OR scraped_job_id IS NOT NULL),
    UNIQUE(user_id, job_id),
    UNIQUE(user_id, scraped_job_id)
);

-- Enable RLS
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_application_tracker ENABLE ROW LEVEL SECURITY;

-- Policies for saved_jobs
CREATE POLICY "Users can manage their own saved jobs"
ON public.saved_jobs
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for job_application_tracker
CREATE POLICY "Users can manage their own application tracker"
ON public.job_application_tracker
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_saved_jobs_user ON public.saved_jobs(user_id);
CREATE INDEX idx_tracker_user ON public.job_application_tracker(user_id);
