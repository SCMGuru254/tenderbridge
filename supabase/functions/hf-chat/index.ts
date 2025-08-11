import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Use a small, instruction-tuned model suitable for free-tier usage
    const tg = await hf.textGeneration({
      model: 'HuggingFaceH4/zephyr-7b-beta',
      inputs: prompt,
      parameters: {
        max_new_tokens: 220,
        temperature: 0.7,
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
