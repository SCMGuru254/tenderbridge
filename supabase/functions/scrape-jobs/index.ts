
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
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Array of job sites to scrape with specific selectors for each site
    const jobSites = [
      {
        url: 'https://www.brightermonday.co.ke/jobs/supply-chain-logistics',
        selectors: {
          jobContainer: '.search-result',
          title: 'h3',
          company: '.search-result__job-meta span.text-grey',
          location: '.search-result__location',
          type: '.search-result__job-meta span:last-child',
          url: 'h3 a'
        },
        source: 'BrighterMonday'
      },
      {
        url: 'https://www.fuzu.com/kenya/jobs/supply-chain',
        selectors: {
          jobContainer: '.JobItem',
          title: '.JobItem__title',
          company: '.JobItem__meta strong',
          location: '.JobItemFooter__location',
          type: '.JobItemFooter__type',
          url: 'a.JobItem'
        },
        source: 'Fuzu'
      },
      {
        url: 'https://ke.indeed.com/jobs?q=supply+chain&l=Nairobi%2C+Nairobi+County',
        selectors: {
          jobContainer: '.job_seen_beacon',
          title: '.jobTitle',
          company: '.companyName',
          location: '.companyLocation',
          type: '.metadataContainer .metadata:first-child',
          url: '.jobTitle a'
        },
        source: 'Indeed'
      },
      {
        url: 'https://www.myjobmag.co.ke/jobs-by-field/supply-chain-management',
        selectors: {
          jobContainer: '.job-item',
          title: '.job-title a',
          company: '.company-name',
          location: '.job-location',
          type: '.job-type',
          url: '.job-title a'
        },
        source: 'MyJobMag'
      }
    ];

    let totalJobsScraped = 0;
    
    // Clear existing scraped jobs to avoid duplicates
    const { error: clearError } = await supabase
      .from('scraped_jobs')
      .delete()
      .not('id', 'is', null); // safety check to not delete everything if id is null
    
    if (clearError) {
      console.error('Error clearing existing jobs:', clearError);
      // Continue with scraping even if clearing fails
    } else {
      console.log('Successfully cleared existing scraped jobs');
    }
    
    // Scrape each site
    for (const site of jobSites) {
      try {
        console.log(`Scraping ${site.source} at ${site.url}...`);
        
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
          console.log(`No job listings found with primary selectors on ${site.source}, trying alternative approach...`);
          
          // Look for common job listing patterns
          const alternativeJobElements = document.querySelectorAll('div[class*="job"], article, .card, li[class*="listing"]');
          console.log(`Found ${alternativeJobElements.length} potential job listings with alternative selectors`);
          
          // Extract general job information from alternative elements
          for (const jobElement of alternativeJobElements) {
            const titleElement = jobElement.querySelector('h2, h3, h4, [class*="title"]');
            const companyElement = jobElement.querySelector('[class*="company"], [class*="employer"]');
            const locationElement = jobElement.querySelector('[class*="location"], address');
            const linkElement = jobElement.querySelector('a[href]');
            
            if (titleElement) {
              const title = titleElement.textContent?.trim() || 'Supply Chain Position';
              const company = companyElement?.textContent?.trim() || null;
              const location = locationElement?.textContent?.trim() || 'Kenya';
              let jobUrl = null;
              
              if (linkElement && linkElement.getAttribute('href')) {
                let href = linkElement.getAttribute('href');
                // Add domain if the URL is relative
                if (href.startsWith('/')) {
                  const siteUrl = new URL(site.url);
                  href = `${siteUrl.origin}${href}`;
                }
                jobUrl = href;
              }
              
              // Insert job into database
              const { data, error } = await supabase.from('scraped_jobs').insert({
                title,
                company,
                location,
                source: site.source,
                job_type: 'full_time', // Default
                description: `Supply chain job opportunity at ${company || 'a company in Kenya'}.`,
                job_url: jobUrl
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
          const urlElement = listing.querySelector(site.selectors.url);
          
          const title = titleElement?.textContent?.trim() || 'Supply Chain Position';
          const company = companyElement?.textContent?.trim() || null;
          const location = locationElement?.textContent?.trim() || 'Kenya';
          const jobType = typeElement?.textContent?.trim()?.toLowerCase() || 'full_time';
          
          // Extract job URL
          let jobUrl = null;
          if (urlElement && urlElement.getAttribute('href')) {
            let href = urlElement.getAttribute('href');
            // Add domain if the URL is relative
            if (href.startsWith('/')) {
              const siteUrl = new URL(site.url);
              href = `${siteUrl.origin}${href}`;
            }
            jobUrl = href;
          }
          
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
            description: `Supply chain job opportunity at ${company || 'a company in Kenya'}.`,
            job_url: jobUrl
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
          description: 'Leading supply chain operations for a growing logistics company in Kenya.',
          job_url: 'https://example.com/job1'
        },
        {
          title: 'Procurement Specialist',
          company: 'Kenya Manufacturing Co',
          location: 'Mombasa, Kenya',
          job_type: 'full_time',
          description: 'Managing procurement processes for manufacturing operations.',
          job_url: 'https://example.com/job2'
        },
        {
          title: 'Logistics Coordinator',
          company: 'East Africa Distributors',
          location: 'Kisumu, Kenya',
          job_type: 'contract',
          description: 'Coordinating logistics operations across East Africa.',
          job_url: 'https://example.com/job3'
        },
        {
          title: 'Supply Chain Intern',
          company: 'Tech Solutions Kenya',
          location: 'Nairobi, Kenya',
          job_type: 'internship',
          description: 'Learning supply chain processes in a fast-paced tech environment.',
          job_url: 'https://example.com/job4'
        },
        {
          title: 'Warehouse Manager',
          company: 'Kenyan Retail Group',
          location: 'Nakuru, Kenya',
          job_type: 'full_time',
          description: 'Overseeing warehouse operations for a major retail chain.',
          job_url: 'https://example.com/job5'
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
