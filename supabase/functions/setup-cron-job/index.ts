
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  try {
    console.log("Starting cron job setup process");
    console.log("Supabase client initialized successfully");

    // Add CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
    
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }

    // Setup the SQL function to periodically fetch news
    console.log("Setting up news refresh function...");

    // First, create the SQL function for refreshing news
    const { error: sqlError } = await supabase.rpc('setup_news_cron_job');

    if (sqlError) {
      console.error("Error setting up news refresh function:", sqlError);
      throw sqlError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cron jobs set up successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error setting up cron jobs:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
