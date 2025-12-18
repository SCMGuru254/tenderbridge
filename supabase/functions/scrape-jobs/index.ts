
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "./utils/cors.ts";
import { scrapeJobSites } from "./services/scraper.ts";
import { clearExistingJobs, insertJob } from "./services/database.ts";
import { getJobSites } from "./config/jobSites.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting comprehensive job scraping process...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
    }

    // Parse request body to get configuration options
    const { 
      refreshAll = true, 
      debug = false, 
      testMode = false, 
      forceUpdate = false,
      sources = [],
      keywords = [],
      minJobsRequired = 20
    } = await req.json();

    console.log(`Job scraping request received with options:`, { 
      refreshAll, debug, testMode, forceUpdate, sources, keywords, minJobsRequired 
    });

    // Clear existing scraped jobs only if we're doing a full refresh and not in test mode
    if (refreshAll && !testMode) {
      console.log('Clearing existing scraped jobs...');
      const clearResult = await clearExistingJobs(supabaseUrl, supabaseKey);
      if (clearResult.error) {
        console.error('Error clearing existing jobs:', clearResult.error);
        // Continue with scraping even if clearing fails
      } else {
        console.log('Successfully cleared existing scraped jobs');
      }
    }
    
    // Get job sites configuration - filter by requested sources if specified
    const allJobSites = getJobSites();
    
    if (!Array.isArray(allJobSites)) {
      console.error('getJobSites() did not return an array. Bailing out.');
      throw new Error('Configuration error: Job sites could not be loaded.');
    }

    const jobSites = sources.length > 0
      ? allJobSites.filter(site => sources.includes(site.source))
      : allJobSites;

    if (!Array.isArray(jobSites)) {
        console.error('Filtered jobSites is not an array!', jobSites);
        throw new Error('Filtering error: jobSites is not an array after filtering.');
    }
    
    console.log(`Will scrape ${jobSites.length} job sources: ${jobSites.map(site => site.source).join(', ')}`);
    
    // Prepare response data with source results
    let totalJobsScraped = 0;
    let sourceResults: Record<string, any> = {};
    let allSuccessfulJobs: any[] = [];
    
    // Scrape each site and process the results
    for (const site of jobSites) {
      console.log(`Scraping jobs from: ${site.source}`);
      try {
        // Add keywords for more targeted scraping
        const siteConfig = keywords.length > 0
          ? { ...site, keywords: keywords }
          : site;
          
        // Pass individual site to scraper (not array)
        const scrapedJobs = await scrapeJobSites(siteConfig);
        console.log(`Scraped ${scrapedJobs.length} jobs from ${site.source}`);
        
        // Track all successful jobs before insertion
        allSuccessfulJobs.push(...scrapedJobs);
        
        // Insert each job into the database unless in test mode
        let sourceJobsInserted = 0;
        if (!testMode) {
          for (const job of scrapedJobs) {
            // Ensure job URLs are correctly captured
            if (!job.job_url && job.application_url) {
              job.job_url = job.application_url;
            }
            
            const insertResult = await insertJob(supabaseUrl, supabaseKey, job);
            if (insertResult.error) {
              console.error(`Error inserting job from ${site.source}:`, insertResult.error);
            } else {
              sourceJobsInserted++;
              totalJobsScraped++;
              console.log(`Inserted job: ${job.title} at ${job.company || 'Unknown'} from ${job.source}`);
              
              if (debug) {
                console.log(`Job URL: ${job.job_url || 'None'}`);
                console.log(`Application URL: ${job.application_url || 'None'}`);
              }
            }
          }
        } else {
          console.log(`Test mode: Would have inserted ${scrapedJobs.length} jobs from ${site.source}`);
          // Log details of first job for debugging
          if (scrapedJobs.length > 0 && debug) {
            console.log('Sample job:', JSON.stringify(scrapedJobs[0], null, 2));
          }
        }
        
        // Track success for this source
        sourceResults[site.source] = { 
          success: true, 
          jobsFound: scrapedJobs.length,
          jobsInserted: sourceJobsInserted,
          message: `Successfully scraped ${scrapedJobs.length} jobs` 
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error scraping from ${site.source}:`, error);
        sourceResults[site.source] = {
          success: false,
          error: message,
          message: `Failed to scrape: ${message}`
        };
      }
    }

    console.log(`Job scraping completed. Total jobs added: ${totalJobsScraped}`);
    console.log('Source results:', JSON.stringify(sourceResults));

    // Check if we met the minimum jobs requirement
    const meetsMinimum = totalJobsScraped >= minJobsRequired;
    if (!meetsMinimum) {
      console.warn(`⚠️ Only scraped ${totalJobsScraped} jobs, below minimum of ${minJobsRequired}`);
    }

    // Enhanced reporting
    const successfulSources = Object.entries(sourceResults).filter(([_, result]) => (result as any).success);
    const failedSources = Object.entries(sourceResults).filter(([_, result]) => !(result as any).success);
    
    const report = {
      success: true,
      message: `Successfully processed ${totalJobsScraped} jobs from ${successfulSources.length}/${jobSites.length} sources`,
      totalJobsScraped,
      minJobsRequired,
      meetsMinimum,
      sourceResults: sourceResults,
      testMode: testMode,
      summary: {
        totalSources: jobSites.length,
        successfulSources: successfulSources.length,
        failedSources: failedSources.length,
        averageJobsPerSource: totalJobsScraped / Math.max(successfulSources.length, 1)
      }
    };

    return new Response(JSON.stringify(report), {
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
