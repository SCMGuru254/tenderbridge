// @deno-types="https://raw.githubusercontent.com/denoland/deno/main/cli/dts/lib.deno.ns.d.ts"
// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    // 2. Get User
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
         return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Rate Limiting
    const { data: allowed, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
        action_type: 'ai_chat',
        max_actions: 10,     // 10 messages
        window_minutes: 5,   // per 5 minutes
        user_id: user.id
    });

    if (rateLimitError) {
        console.error('Rate limit error:', rateLimitError);
        // Fail open if function missing, but log it.
    }

    if (allowed === false) {
        return new Response(JSON.stringify({ 
            error: 'Rate limit exceeded. Please wait a moment before sending more messages.' 
        }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const { message, context, conversation_history } = await req.json();

    const hfKey = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfKey) {
      return new Response(JSON.stringify({
        error: 'Missing HUGGING_FACE_ACCESS_TOKEN',
        response: 'AI service is temporarily unavailable (no HF key).'
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const hf = new HfInference(hfKey);

    const sys = context || 'You are a helpful assistant for supply chain careers in East Africa.';
    const historyText = (conversation_history || [])
      .slice(-6)
      .map((m: any) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`)
      .join('\n');

    const prompt = `${sys}\n\n${historyText ? historyText + '\n' : ''}User: ${message}\nAssistant:`;

    // Use a small, efficient model with strict token limits
    const tg = await hf.textGeneration({
      model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.6,
        do_sample: true,
        repetition_penalty: 1.1,
        return_full_text: false,
      }
    });

    const text = Array.isArray(tg) ? tg[0]?.generated_text : (tg as any)?.generated_text;
    const response = text || 'Sorry, I could not generate a response right now.';

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('hf-chat error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
