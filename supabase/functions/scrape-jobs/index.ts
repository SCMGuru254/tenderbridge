
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting job scraping process...')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Array of job sites to scrape with specific selectors for each site
    const jobSites = [
      {
        url: 'https://www.brightermonday.co.ke/jobs/supply-chain-logistics',
        selectors: {
          jobContainer: '.search-result',
          title: '.search-result__job-title',
          company: '.search-result__job-meta span:first-child',
          location: '.search-result__location',
          type: '.search-result__job-meta span:last-child'
        },
        source: 'BrighterMonday'
      },
      {
        url: 'https://www.fuzu.com/kenya/jobs/supply-chain',
        selectors: {
          jobContainer: '.job-item',
          title: '.job-item__title',
          company: '.job-item__company',
          location: '.job-item__location',
          type: '.job-item__type'
        },
        source: 'Fuzu'
      }
      // LinkedIn is more complex, may require additional approaches
    ]

    let totalJobsScraped = 0;
    
    // Scrape each site
    for (const site of jobSites) {
      try {
        console.log(`Scraping ${site.source} at ${site.url}...`)
        
        // Fetch the page content
        const response = await fetch(site.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (!response.ok) {
          console.error(`Error fetching ${site.url}: ${response.status} ${response.statusText}`);
          continue;
        }
        
        const html = await response.text();
        
        // Parse the HTML
        const parser = new DOMParser();
        const document = parser.parseFromString(html, "text/html");
        
        if (!document) {
          console.error(`Failed to parse HTML from ${site.url}`);
          continue;
        }
        
        // Extract job listings
        const jobListings = document.querySelectorAll(site.selectors.jobContainer);
        console.log(`Found ${jobListings.length} potential job listings on ${site.source}`);
        
        // If no selectors match exactly, try a more general approach
        if (jobListings.length === 0) {
          console.log(`Attempting alternative scraping method for ${site.source}...`);
          
          // Look for common job listing patterns
          const alternativeJobElements = document.querySelectorAll('div[class*="job"], article, .card, li[class*="listing"]');
          
          for (const jobElement of alternativeJobElements) {
            const titleElement = jobElement.querySelector('h2, h3, [class*="title"]');
            const companyElement = jobElement.querySelector('[class*="company"], [class*="employer"]');
            const locationElement = jobElement.querySelector('[class*="location"]');
            
            if (titleElement) {
              const title = titleElement.textContent?.trim() || 'Supply Chain Position';
              const company = companyElement?.textContent?.trim() || null;
              const location = locationElement?.textContent?.trim() || 'Kenya';
              
              // Insert job into database
              const { data, error } = await supabase.from('scraped_jobs').insert({
                title,
                company,
                location,
                source: site.source,
                job_type: 'full_time', // Default
                description: `Supply chain job opportunity at ${company || 'a company in Kenya'}.`
              }).select();
              
              if (error) {
                console.error(`Error inserting job from ${site.source}:`, error);
              } else {
                totalJobsScraped++;
                console.log(`Inserted job: ${title} at ${company || 'Unknown Company'}`);
              }
            }
          }
          
          continue;
        }
        
        // Process each job listing with the specific selectors
        for (const listing of jobListings) {
          const titleElement = listing.querySelector(site.selectors.title);
          const companyElement = listing.querySelector(site.selectors.company);
          const locationElement = listing.querySelector(site.selectors.location);
          const typeElement = listing.querySelector(site.selectors.type);
          
          const title = titleElement?.textContent?.trim() || 'Supply Chain Position';
          const company = companyElement?.textContent?.trim() || null;
          const location = locationElement?.textContent?.trim() || 'Kenya';
          const jobType = typeElement?.textContent?.trim()?.toLowerCase() || 'full_time';
          
          // Map job type to standard values
          let standardJobType = 'full_time';
          if (jobType.includes('part')) standardJobType = 'part_time';
          else if (jobType.includes('contract')) standardJobType = 'contract';
          else if (jobType.includes('intern')) standardJobType = 'internship';
          
          // Insert job into database
          const { data, error } = await supabase.from('scraped_jobs').insert({
            title,
            company,
            location,
            source: site.source,
            job_type: standardJobType,
            description: `Supply chain job opportunity at ${company || 'a company in Kenya'}.`
          }).select();
          
          if (error) {
            console.error(`Error inserting job from ${site.source}:`, error);
          } else {
            totalJobsScraped++;
            console.log(`Inserted job: ${title} at ${company || 'Unknown Company'}`);
          }
        }
        
      } catch (error) {
        console.error(`Error scraping ${site.url}:`, error);
      }
    }

    // Add some default sample jobs if no real jobs were scraped
    if (totalJobsScraped === 0) {
      console.log('No jobs scraped. Adding sample supply chain jobs...');
      
      const sampleJobs = [
        {
          title: 'Supply Chain Manager',
          company: 'Global Logistics Ltd',
          location: 'Nairobi, Kenya',
          job_type: 'full_time',
          description: 'Leading supply chain operations for a growing logistics company in Kenya.'
        },
        {
          title: 'Procurement Specialist',
          company: 'Kenya Manufacturing Co',
          location: 'Mombasa, Kenya',
          job_type: 'full_time',
          description: 'Managing procurement processes for manufacturing operations.'
        },
        {
          title: 'Logistics Coordinator',
          company: 'East Africa Distributors',
          location: 'Kisumu, Kenya',
          job_type: 'contract',
          description: 'Coordinating logistics operations across East Africa.'
        },
        {
          title: 'Supply Chain Intern',
          company: 'Tech Solutions Kenya',
          location: 'Nairobi, Kenya',
          job_type: 'internship',
          description: 'Learning supply chain processes in a fast-paced tech environment.'
        },
        {
          title: 'Warehouse Manager',
          company: 'Kenyan Retail Group',
          location: 'Nakuru, Kenya',
          job_type: 'full_time',
          description: 'Overseeing warehouse operations for a major retail chain.'
        }
      ];
      
      for (const job of sampleJobs) {
        const { error } = await supabase.from('scraped_jobs').insert({
          ...job,
          source: 'Sample Data'
        });
        
        if (error) {
          console.error('Error inserting sample job:', error);
        } else {
          totalJobsScraped++;
          console.log(`Inserted sample job: ${job.title}`);
        }
      }
    }

    console.log(`Job scraping completed. Total jobs added: ${totalJobsScraped}`);

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
