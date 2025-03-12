
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

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
    // Get the request data
    const { query, skills = [], experience = "entry_level", jobType = "full_time" } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables for Supabase connection');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch jobs from database that might match the query
    let jobsQuery = supabase
      .from('scraped_jobs')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(10);
    
    // Add filters if provided
    if (skills.length > 0) {
      jobsQuery = jobsQuery.contains('skills', skills);
    }
    
    if (experience !== "any") {
      jobsQuery = jobsQuery.eq('experience_level', experience);
    }
    
    if (jobType !== "any") {
      jobsQuery = jobsQuery.eq('job_type', jobType);
    }
    
    const { data: matchedJobs, error } = await jobsQuery;
    
    if (error) {
      throw new Error(`Error fetching jobs: ${error.message}`);
    }
    
    // Generate a helpful response based on the matched jobs
    let responseText = '';
    
    if (matchedJobs && matchedJobs.length > 0) {
      responseText = `I found ${matchedJobs.length} jobs that match your criteria:\n\n`;
      
      matchedJobs.forEach((job, index) => {
        responseText += `${index + 1}. ${job.title} at ${job.company || 'Unknown Company'}\n`;
        responseText += `   Location: ${job.location || 'Kenya'}\n`;
        responseText += `   Type: ${job.job_type || 'Full-time'}\n`;
        if (job.salary_range) {
          responseText += `   Salary: ${job.salary_range}\n`;
        }
        responseText += `\n`;
      });
      
      responseText += `\nWould you like more details about any of these positions? You can ask about specific skills required, application process, or other aspects.`;
    } else {
      responseText = `I couldn't find any jobs matching "${query}" with your criteria. Try broadening your search or using different keywords. Consider looking at logistics, procurement, or operations roles which are related to supply chain.`;
    }
    
    // Return the response
    return new Response(JSON.stringify({
      message: responseText,
      matchedJobs: matchedJobs || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in job-match-chat function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      message: "I'm sorry, I encountered an error while searching for matching jobs. Please try again with different criteria."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
