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

    console.log('Starting news scraping...')

    // Using RSS feeds for supply chain news
    const newsSources = [
      'https://www.supplychaindigital.com/rss.xml',
      'https://www.logisticsmgmt.com/rss',
      'https://www.supplychain247.com/rss'
    ]

    for (const source of newsSources) {
      try {
        const response = await fetch(source)
        const xml = await response.text()
        
        // Basic RSS parsing
        const items = xml.match(/<item>(.*?)<\/item>/gs) || []
        
        for (const item of items) {
          const title = item.match(/<title>(.*?)<\/title>/)?.[1] || ''
          const content = item.match(/<description>(.*?)<\/description>/)?.[1] || ''
          const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
          const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
          
          // Insert into database
          await supabase.from('supply_chain_news').insert({
            title,
            content,
            source_url: link,
            source_name: source,
            published_date: new Date(pubDate)
          })
        }
      } catch (error) {
        console.error(`Error scraping ${source}:`, error)
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