
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get the Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Setup SQL function for cron job refresh
    const { data: functionData, error: functionError } = await supabase.rpc('setup_news_refresh_function');
    
    if (functionError) {
      console.error("Error setting up news refresh function:", functionError);
      throw functionError;
    }
    
    console.log("Created news refresh function:", functionData);

    // Setup cron job to run daily at midnight
    const { data: cronData, error: cronError } = await supabase.rpc('setup_news_refresh_cron');
    
    if (cronError) {
      console.error("Error setting up news refresh cron:", cronError);
      throw cronError;
    }
    
    console.log("Set up news refresh cron job:", cronData);

    // Setup blog posts cleanup function and cron
    const { data: blogCleanupFunctionData, error: blogCleanupFunctionError } = 
      await supabase.rpc('setup_blog_cleanup_function');
    
    if (blogCleanupFunctionError) {
      console.error("Error setting up blog cleanup function:", blogCleanupFunctionError);
      throw blogCleanupFunctionError;
    }
    
    console.log("Created blog cleanup function:", blogCleanupFunctionData);

    // Setup cron job to run daily at 1 AM
    const { data: blogCleanupCronData, error: blogCleanupCronError } = 
      await supabase.rpc('setup_blog_cleanup_cron');
    
    if (blogCleanupCronError) {
      console.error("Error setting up blog cleanup cron:", blogCleanupCronError);
      throw blogCleanupCronError;
    }
    
    console.log("Set up blog cleanup cron job:", blogCleanupCronData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully set up all cron jobs",
        newsRefreshFunction: functionData,
        newsRefreshCron: cronData,
        blogCleanupFunction: blogCleanupFunctionData,
        blogCleanupCron: blogCleanupCronData
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error setting up cron jobs:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
