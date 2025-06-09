
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers defined locally to avoid import issues
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
    }

    // Parse request body to get configuration options
    const { 
      authorizationKey,
      refreshAll = true,
      sources = ['Google Search 24h'] // Default to only refresh Google Search 24h jobs
    } = await req.json();

    // Verify authorization key if provided
    const expectedKey = Deno.env.get('SCHEDULED_JOBS_KEY');
    if (expectedKey && authorizationKey !== expectedKey) {
      return new Response(JSON.stringify({
        error: 'Invalid authorization key',
        success: false
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Starting scheduled job refresh...');
    
    // Call the scrape-jobs function to refresh the jobs
    const response = await fetch(`${supabaseUrl}/functions/v1/scrape-jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        refreshAll,
        sources,
        forceUpdate: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh jobs: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    
    // Send notifications for new jobs if needed
    if (result.success && sources.includes('Google Search 24h')) {
      await sendNewJobNotifications(supabaseUrl, supabaseKey);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Scheduled job completed successfully',
      result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in scheduled jobs function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

/**
 * Send notifications for new jobs to users who have preferences set
 */
async function sendNewJobNotifications(supabaseUrl: string, supabaseKey: string) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get jobs posted today
    const today = new Date().toISOString().split('T')[0];
    const { data: newJobs, error: jobsError } = await supabase
      .from('scraped_jobs')
      .select('id, title, company')
      .eq('date_posted', today);
    
    if (jobsError || !newJobs || newJobs.length === 0) {
      console.log('No new jobs found or error fetching jobs:', jobsError);
      return;
    }
    
    console.log(`Found ${newJobs.length} new jobs posted today`);
    
    // Get users with preferences
    const { data: users, error: usersError } = await supabase
      .from('user_job_preferences')
      .select('user_id')
      .distinct();
    
    if (usersError || !users || users.length === 0) {
      console.log('No users with preferences found or error fetching users:', usersError);
      return;
    }
    
    console.log(`Found ${users.length} users with job preferences`);
    
    // Create notifications for each user
    for (const user of users) {
      await supabase
        .from('notifications')
        .insert({
          user_id: user.user_id,
          message: `${newJobs.length} new supply chain jobs posted today!`,
          type: 'new_job',
          is_read: false,
          created_at: new Date().toISOString(),
          scheduled_for: new Date().toISOString()
        });
    }
    
    console.log(`Created notifications for ${users.length} users`);
  } catch (error) {
    console.error('Error sending new job notifications:', error);
  }
}
