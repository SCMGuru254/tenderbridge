import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
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
    console.log('Starting automated news cleanup...');
    
    const { retention_days = 7 } = await req.json().catch(() => ({}));
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retention_days);
    
    console.log(`Deleting news older than ${cutoffDate.toISOString()}`);
    
    const { data, error, count } = await supabase
      .from('supply_chain_news')
      .delete({ count: 'exact' })
      .lt('created_at', cutoffDate.toISOString());

    if (error) {
      console.error('Error deleting old news:', error);
      throw error;
    }

    console.log(`Successfully deleted ${count || 0} old news items`);

    return new Response(
      JSON.stringify({
        success: true,
        deleted_count: count || 0,
        cutoff_date: cutoffDate.toISOString(),
        message: `Successfully deleted ${count || 0} news items older than ${retention_days} days`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in cleanup-old-news:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to cleanup old news'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
