
-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to set up the news refresh cron job
CREATE OR REPLACE FUNCTION public.setup_news_cron_job()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  project_url text := current_setting('request.headers')::json->>'origin';
  anon_key text := current_setting('supabase_anon_key');
  job_id bigint;
BEGIN
  -- Check if the job already exists
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'refresh_news_job';
  
  -- If job exists, drop it first
  IF job_id IS NOT NULL THEN
    PERFORM cron.unschedule(job_id);
  END IF;
  
  -- Schedule new job to run every 6 hours
  SELECT cron.schedule(
    'refresh_news_job',
    '0 */6 * * *', -- every 6 hours
    $$
    SELECT net.http_post(
      url:='{{supabase_url}}/functions/v1/scrape-news',
      headers:='{
        "Content-Type": "application/json",
        "Authorization": "Bearer {{anon_key}}"
      }'::jsonb,
      body:='{}'::jsonb
    ) AS request_id;
    $$
  ) INTO job_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'job_id', job_id,
    'message', 'News refresh cron job scheduled successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM,
      'error_code', SQLSTATE
    );
END;
$$;
