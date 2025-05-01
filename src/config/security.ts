
import { HfInference } from '@huggingface/inference';

// Validate API keys with fallback for development mode
const validateApiKey = (key: string | undefined, service: string, isRequired: boolean = true): string | null => {
  if (!key) {
    if (isRequired) {
      console.warn(`Missing ${service} API key. Some features may not work properly.`);
    }
    return null;
  }
  if (key.length < 20) {
    console.warn(`Invalid ${service} API key format. Please check your environment variables.`);
    return null;
  }
  return key;
};

// Initialize services with validated API keys
export const initializeServices = () => {
  try {
    // Check if we're in development mode
    const isDev = import.meta.env.DEV;
    
    // Validate and initialize Hugging Face (optional in dev mode)
    const hfApiKey = validateApiKey(import.meta.env.VITE_HUGGINGFACE_API_KEY, 'Hugging Face', !isDev);
    const hf = hfApiKey ? new HfInference(hfApiKey) : null;

    // Validate Supabase (optional in dev mode)
    validateApiKey(import.meta.env.VITE_SUPABASE_URL, 'Supabase URL', !isDev);
    validateApiKey(import.meta.env.VITE_SUPABASE_ANON_KEY, 'Supabase Anon Key', !isDev);

    // Validate Google Search (optional in dev mode)
    validateApiKey(import.meta.env.VITE_GOOGLE_API_KEY, 'Google API', !isDev);
    validateApiKey(import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID, 'Google Search Engine', !isDev);

    return {
      hf,
      isInitialized: !!hf
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
