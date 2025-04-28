import { HfInference } from '@huggingface/inference';

// Validate API keys
const validateApiKey = (key: string | undefined, service: string): string => {
  if (!key) {
    throw new Error(`Missing ${service} API key. Please add it to your .env file`);
  }
  if (key.length < 20) {
    throw new Error(`Invalid ${service} API key format`);
  }
  return key;
};

// Initialize services with validated API keys
export const initializeServices = () => {
  try {
    // Validate and initialize Hugging Face
    const hfApiKey = validateApiKey(import.meta.env.VITE_HUGGINGFACE_API_KEY, 'Hugging Face');
    const hf = new HfInference(hfApiKey);

    // Validate Supabase
    validateApiKey(import.meta.env.VITE_SUPABASE_URL, 'Supabase URL');
    validateApiKey(import.meta.env.VITE_SUPABASE_ANON_KEY, 'Supabase Anon Key');

    // Validate Google Search
    validateApiKey(import.meta.env.VITE_GOOGLE_API_KEY, 'Google API');
    validateApiKey(import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID, 'Google Search Engine');

    return {
      hf,
      isInitialized: true
    };
  } catch (error) {
    console.error('Service initialization failed:', error);
    return {
      hf: null,
      isInitialized: false
    };
  }
};

// Security middleware for API routes
export const apiSecurityMiddleware = (req: Request, res: Response, next: Function) => {
  // Add security headers
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Validate API key presence
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  next();
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}; 