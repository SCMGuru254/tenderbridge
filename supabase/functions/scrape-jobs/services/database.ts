
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Job } from "../types/job.ts";

export async function clearExistingJobs(supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  return await supabase
    .from('scraped_jobs')
    .delete()
    .not('id', 'is', null); // safety check to not delete everything if id is null
}

export async function insertJob(supabaseUrl: string, supabaseKey: string, job: Job) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  return await supabase.from('scraped_jobs').insert({
    title: job.title,
    company: job.company,
    location: job.location,
    source: job.source,
    job_type: job.job_type,
    description: job.description,
    job_url: job.job_url
  }).select();
}
