import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userProfile } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Extract keywords from query and user profile
    const keywords = [
      ...query.toLowerCase().split(/\s+/),
      ...userProfile.skills.map((s: string) => s.toLowerCase()),
      ...userProfile.preferredLocations.map((l: string) => l.toLowerCase()),
      ...userProfile.preferredJobTypes.map((t: string) => t.toLowerCase())
    ].filter((k: string) => k.length > 3);

    // Quick search using keywords (avoid full-text helpers that aren't available in Deno typings)
    const orFilters = keywords
      .flatMap((k: string) => [`title.ilike.%${k}%`, `description.ilike.%${k}%`])
      .join(',');

    const { data: jobs, error } = await supabaseClient
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .or(orFilters)
      .limit(100);

    if (error) throw error;

    // Basic scoring based on keyword matches
    const scoredJobs = (jobs ?? []).map((job: any) => {
      const jobSkills = Array.isArray(job.skills) ? job.skills.join(' ') : '';
      const jobText = `${job.title ?? ''} ${job.description ?? ''} ${jobSkills}`.toLowerCase();
      const score = keywords.reduce((acc: number, keyword: string) => {
        return acc + (jobText.includes(keyword) ? 1 : 0);
      }, 0) / keywords.length;

      return {
        job,
        score: Math.min(score + 0.3, 1), // Base score between 0.3 and 1
        matchingFactors: ['Quick match based on keywords']
      };
    });

    // Sort by score
    const sortedJobs = scoredJobs.sort((a: any, b: any) => b.score - a.score);

    return new Response(
      JSON.stringify(sortedJobs),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in job-match-quick function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
