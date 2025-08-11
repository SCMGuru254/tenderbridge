import { pipeline, env } from '@huggingface/transformers';

let generatorPromise: any | null = null;

// Initialize a lightweight local text-generation model (browser/WebGPU with WASM fallback)
async function getGenerator() {
  if (!generatorPromise) {
    try {
      env.allowLocalModels = false;
      // Use WebGPU when available, otherwise WASM backend
      const device = (typeof navigator !== 'undefined' && (navigator as any).gpu) ? 'webgpu' : 'wasm';
      generatorPromise = pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', { device });
    } catch (e) {
      console.error('Failed to initialize local AI model:', e);
      throw e;
    }
  }
  return generatorPromise;
}

export async function generateChatResponse(
  message: string,
  systemPrompt?: string,
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    const generate = await getGenerator();

    const sys = systemPrompt || 'You are a helpful assistant.';
    const historyText = (history || [])
      .map((m) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`)
      .join('\n');

    const prompt = `${sys}\n\n${historyText ? historyText + '\n' : ''}User: ${message}\nAssistant:`;

    const output: any = await generate(prompt, {
      max_new_tokens: 180,
      temperature: 0.7,
      repetition_penalty: 1.1,
    });

    const text = Array.isArray(output) ? output[0]?.generated_text : output?.generated_text;
    if (!text) return 'Sorry, I could not generate a response right now.';

    const idx = text.lastIndexOf('Assistant:');
    return idx >= 0 ? text.slice(idx + 'Assistant:'.length).trim() : text.trim();
  } catch (error) {
    console.error('Local AI generateChatResponse error:', error);
    return 'AI is warming up. Please try again in a moment.';
  }
}
