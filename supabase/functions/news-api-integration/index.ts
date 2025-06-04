
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const newsApiToken = Deno.env.get('NEWS_API_TOKEN') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerm = '', limit = 50 } = await req.json();

    // Build the News API URL with supply chain focused parameters
    const url = new URL('https://api.thenewsapi.com/v1/news/all');
    url.searchParams.append('api_token', newsApiToken);
    url.searchParams.append('categories', 'business,tech,manufacturing,retail,agriculture');
    url.searchParams.append('search', `supply chain OR logistics OR procurement OR warehousing OR transportation${searchTerm ? ` OR ${searchTerm}` : ''}`);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('sort', 'published_at');
    url.searchParams.append('language', 'en');

    console.log('Fetching news from:', url.toString().replace(newsApiToken, 'HIDDEN_TOKEN'));

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status} ${response.statusText}`);
    }

    const newsData = await response.json();
    
    // Filter and process the news for supply chain relevance
    const supplyChainNews = newsData.data?.filter((article: any) => {
      const title = article.title?.toLowerCase() || '';
      const description = article.description?.toLowerCase() || '';
      const content = title + ' ' + description;
      
      const supplyChainKeywords = [
        'supply chain', 'logistics', 'procurement', 'warehousing', 'transportation',
        'freight', 'shipping', 'distribution', 'inventory', 'manufacturing',
        'port', 'cargo', 'trade', 'import', 'export', 'customs'
      ];
      
      return supplyChainKeywords.some(keyword => content.includes(keyword));
    }) || [];

    // Store filtered news in database
    if (supplyChainNews.length > 0) {
      const newsToStore = supplyChainNews.map((article: any) => ({
        title: article.title || 'No title',
        content: article.description || article.snippet || '',
        source_name: article.source || 'News API',
        source_url: article.url || '',
        published_at: article.published_at || new Date().toISOString(),
        tags: ['Supply Chain', 'News API', ...(article.categories || [])],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('supply_chain_news')
        .upsert(newsToStore, { onConflict: 'source_url' });

      if (insertError) {
        console.error('Error storing news:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: supplyChainNews.length,
        articles: supplyChainNews,
        message: `Successfully fetched ${supplyChainNews.length} supply chain news articles`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in news-api-integration:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
