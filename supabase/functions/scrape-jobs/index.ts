import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting job scraping...')

    // Array of job sites to scrape
    const jobSites = [
      'https://www.brightermonday.co.ke/jobs/supply-chain-logistics',
      'https://www.fuzu.com/kenya/jobs/supply-chain',
      'https://www.linkedin.com/jobs/search/?keywords=supply%20chain&location=Kenya'
    ]

    // Scrape each site
    for (const site of jobSites) {
      try {
        const response = await fetch(site)
        const html = await response.text()
        
        // Basic scraping logic - you might need to adjust selectors based on each site
        const jobListings = html.match(/<div class="job-listing">(.*?)<\/div>/g) || []
        
        for (const listing of jobListings) {
          const title = listing.match(/<h2>(.*?)<\/h2>/)?.[1] || ''
          const company = listing.match(/<span class="company">(.*?)<\/span>/)?.[1] || ''
          const location = listing.match(/<span class="location">(.*?)<\/span>/)?.[1] || ''
          
          // Insert into database
          await supabase.from('scraped_jobs').insert({
            title,
            company,
            location,
            source: site,
            job_type: 'full_time', // Default value
            description: listing
          })
        }
      } catch (error) {
        console.error(`Error scraping ${site}:`, error)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})