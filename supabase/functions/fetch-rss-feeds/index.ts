import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Parser from 'npm:rss-parser@3.13.0'

interface FeedItem {
  title?: string
  content?: string
  contentSnippet?: string
  link?: string
  guid?: string
  pubDate?: string
}

interface RssFeed {
  id: string
  title: string
  url: string
  category: string
}

interface NewsItem {
  title: string
  content: string
  source: string
  source_url: string | null
  guid: string
  rss_feed_id: string
  published_at: string
  tags: string[]
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch active RSS feeds
    const { data: feeds, error: feedError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('active', true)

    if (feedError) throw feedError

    const parser = new Parser()
    const timestamp = new Date().toISOString()

    for (const feed of feeds) {
      try {
        const response = await fetch(feed.url)
        const xml = await response.text()
        const parsed = await parser.parseString(xml)

        // Update last fetch time for the feed
        await supabase
          .from('rss_feeds')
          .update({ 
            last_fetched_at: timestamp,
            fetch_error: null
          })
          .eq('id', feed.id)

        // Process each item in the feed
        const items = parsed.items.map(item => ({
          title: item.title,
          content: item.content || item.contentSnippet || '',
          source: feed.title,
          source_url: item.link,
          guid: item.guid || item.link,
          rss_feed_id: feed.id,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : timestamp,
          tags: feed.category ? [feed.category] : []
        }))

        // Check for existing items and insert only new ones
        for (const item of items) {
          const { data: existing } = await supabase
            .from('news_items')
            .select('guid')
            .eq('rss_feed_id', feed.id)
            .eq('guid', item.guid)
            .single()

          if (!existing) {
            const { error: insertError } = await supabase
              .from('news_items')
              .insert([item])

            if (insertError) {
              console.error(`Error inserting item ${item.title}:`, insertError)
            }
          }
        }

      } catch (error) {
        // Log feed-specific errors but continue processing other feeds
        console.error(`Error processing feed ${feed.title}:`, error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        await supabase
          .from('rss_feeds')
          .update({ 
            last_fetched_at: timestamp,
            fetch_error: errorMessage
          })
          .eq('id', feed.id)
      }
    }

    return new Response(
      JSON.stringify({ message: 'RSS feeds processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})