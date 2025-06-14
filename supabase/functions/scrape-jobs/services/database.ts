
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Job } from "../types/job.ts";

export async function clearExistingJobs(supabaseUrl: string, supabaseKey: string) {
  console.log('🗑️ Clearing existing scraped jobs...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const result = await supabase
      .from('scraped_jobs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID
    
    console.log(`✅ Cleared ${result.count || 0} existing jobs`);
    return result;
  } catch (error) {
    console.error('❌ Error clearing jobs:', error);
    return { error };
  }
}

export async function insertJob(supabaseUrl: string, supabaseKey: string, job: Job) {
  console.log(`💾 Inserting job: ${job.title} at ${job.company}`);
  
  // Clean and validate job data
  const cleanJob = cleanJobData(job);
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const result = await supabase
      .from('scraped_jobs')
      .insert({
        title: cleanJob.title,
        company: cleanJob.company,
        location: cleanJob.location,
        source: cleanJob.source,
        job_type: cleanJob.job_type,
        description: cleanJob.description || '',
        job_url: cleanJob.job_url,
        application_url: cleanJob.application_url || cleanJob.job_url,
        // Remove date_posted - it doesn't exist in the schema
        application_deadline: cleanJob.application_deadline,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (result.error) {
      console.error(`❌ Error inserting job "${job.title}":`, result.error);
    } else {
      console.log(`✅ Successfully inserted job: ${job.title}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Exception inserting job "${job.title}":`, error);
    return { error };
  }
}

function cleanJobData(job: Job): Job {
  // Ensure URLs are properly formatted
  let jobUrl = job.job_url;
  let applicationUrl = job.application_url;
  
  if (jobUrl && !jobUrl.startsWith('http')) {
    jobUrl = 'https://' + jobUrl.replace(/^\/+/, '');
  }
  
  if (applicationUrl && !applicationUrl.startsWith('http')) {
    applicationUrl = 'https://' + applicationUrl.replace(/^\/+/, '');
  }
  
  return {
    ...job,
    title: job.title.trim().slice(0, 255), // Ensure title fits in database
    company: job.company?.trim().slice(0, 255) || 'Company not specified',
    location: job.location?.trim().slice(0, 255) || 'Kenya',
    description: job.description?.trim().slice(0, 5000) || '', // Limit description length
    job_url: jobUrl,
    application_url: applicationUrl || jobUrl,
    job_type: job.job_type || 'full_time',
    source: job.source
  };
}

export async function getJobCount(supabaseUrl: string, supabaseKey: string): Promise<number> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const { count, error } = await supabase
      .from('scraped_jobs')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error getting job count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('❌ Exception getting job count:', error);
    return 0;
  }
}
