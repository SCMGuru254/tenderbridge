
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "./utils/cors.ts";
import { scrapeJobSites } from "./services/scraper.ts";
import { clearExistingJobs, insertJob } from "./services/database.ts";
import { getJobSites } from "./config/jobSites.ts";
import { getFallbackJobs } from "./data/fallbackJobs.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting job scraping process...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
    }

    // Clear existing scraped jobs to avoid duplicates
    const clearResult = await clearExistingJobs(supabaseUrl, supabaseKey);
    if (clearResult.error) {
      console.error('Error clearing existing jobs:', clearResult.error);
      // Continue with scraping even if clearing fails
    } else {
      console.log('Successfully cleared existing scraped jobs');
    }
    
    // Get job sites configuration
    const jobSites = getJobSites();
    
    // Scrape each site and process the results
    let totalJobsScraped = 0;
    for (const site of jobSites) {
      const scrapedJobs = await scrapeJobSites(site);
      
      // Insert each job into the database
      for (const job of scrapedJobs) {
        const insertResult = await insertJob(supabaseUrl, supabaseKey, job);
        if (insertResult.error) {
          console.error(`Error inserting job from ${site.source}:`, insertResult.error);
        } else {
          totalJobsScraped++;
          console.log(`Inserted job: ${job.title} at ${job.company}`);
        }
      }
    }

    console.log(`Job scraping completed. Total jobs added: ${totalJobsScraped}`);
    
    // Only add fallback jobs if no real jobs were scraped
    if (totalJobsScraped === 0) {
      console.warn('WARNING: No jobs scraped. Adding real supply chain jobs as fallback...');
      
      const fallbackJobs = getFallbackJobs();
      
      for (const job of fallbackJobs) {
        const insertResult = await insertJob(supabaseUrl, supabaseKey, job);
        if (insertResult.error) {
          console.error('Error inserting fallback job:', insertResult.error);
        } else {
          totalJobsScraped++;
          console.log(`Inserted fallback job: ${job.title}`);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Successfully scraped ${totalJobsScraped} jobs` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in scraping function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
