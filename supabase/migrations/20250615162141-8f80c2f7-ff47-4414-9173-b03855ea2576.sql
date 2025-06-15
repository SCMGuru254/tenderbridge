
-- Add a column for the source's original posting date/time to scraped_jobs
ALTER TABLE public.scraped_jobs
ADD COLUMN IF NOT EXISTS source_posted_at timestamp with time zone;

-- Optional: Index for performance
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_source_posted_at
  ON public.scraped_jobs (source_posted_at);

-- NO changes to other tables. Main job metadata will now show "posted X ago" based on this field!
