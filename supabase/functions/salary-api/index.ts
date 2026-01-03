
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    // Initialize with auth header to respect RLS
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader! } },
    });

    const url = new URL(req.url);
    const jobTitle = url.searchParams.get("job_title");
    const location = url.searchParams.get("location");
    const groupBy = url.searchParams.get("group_by"); // 'job_title' or 'location'

    // Aggregation Mode
    if (groupBy) {
        // Note: Supabase JS doesn't support easy GROUP BY without RPC or raw SQL (which isn't exposed easily via client unless RPC).
        // For simplicity, we fetch data and aggregate in Deno (if data set is small) or suggesting RPC.
        // We'll fetch raw and aggregate here for now (assuming < 1000 records context).
        
        let query = supabase.from("salary_submissions").select("*");
        if (jobTitle) query = query.ilike("job_title", `%${jobTitle}%`);
        if (location) query = query.ilike("location", `%${location}%`);
        
        const { data, error } = await query;
        if (error) throw error;

        // Simple stats
        const stats: Record<string, any> = {};
        data?.forEach((s: any) => {
            const key = s[groupBy] || 'Unknown';
            if (!stats[key]) stats[key] = { count: 0, total: 0, min: s.salary_amount, max: s.salary_amount };
            stats[key].count++;
            stats[key].total += Number(s.salary_amount);
            stats[key].min = Math.min(stats[key].min, s.salary_amount);
            stats[key].max = Math.max(stats[key].max, s.salary_amount);
        });

        // Calculate average
        const results = Object.keys(stats).map(key => ({
            [groupBy]: key,
            count: stats[key].count,
            average_salary: Math.round(stats[key].total / stats[key].count),
            min_salary: stats[key].min,
            max_salary: stats[key].max,
            currency: 'KES' // Default
        }));

        return new Response(JSON.stringify(results), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Raw List Mode
    let query = supabase.from("salary_submissions").select("*").order("created_at", { ascending: false }).limit(50);
    if (jobTitle) query = query.ilike("job_title", `%${jobTitle}%`);
    if (location) query = query.ilike("location", `%${location}%`);

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
