// @deno-types="https://raw.githubusercontent.com/denoland/deno/main/cli/dts/lib.deno.ns.d.ts"
// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
        max_new_tokens: 200, // Reduced from 220 to ensure we stay within limits
        temperature: 0.6, // Reduced for more focused responses
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
