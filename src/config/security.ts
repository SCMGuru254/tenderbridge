
import { HfInference } from '@huggingface/inference';

// Validate API keys with better fallback for development mode
const validateApiKey = (key: string | undefined, service: string, isRequired: boolean = true): string | null => {
  if (!key) {
    if (isRequired) {
      console.warn(`Missing ${service} API key. Using mock services in development mode.`);
    }
    return null;
  }
  // Don't check key length in dev mode to allow for test keys
  if (import.meta.env.PROD && key.length < 10) {
    console.warn(`Possibly invalid ${service} API key format. Please check your environment variables.`);
  }
  return key;
};

// Initialize services with validated API keys
export const initializeServices = () => {
  try {
    // Check if we're in development mode
    const isDev = import.meta.env.DEV;
    
    // Validate and initialize Hugging Face (optional in dev mode)
    const hfApiKey = validateApiKey(
      import.meta.env.VITE_HUGGINGFACE_API_KEY,
      'Hugging Face', 
      !isDev
    );
    
    // Create HF client with fallback for development
    let hf = null;
    try {
      hf = hfApiKey ? new HfInference(hfApiKey) : (isDev ? new HfInference('mock-key-for-dev') : null);
    } catch (error) {
      console.warn('Failed to initialize HF client:', error);
      // In development, provide a mock client for testing
      if (isDev) {
        hf = {
          textGeneration: async () => ({ generated_text: 'This is a mock response in development mode.' }),
          featureExtraction: async () => [[0.1, 0.2, 0.3]] // Mock embeddings
        };
      }
    }

    // Validate Supabase (optional in dev mode)
    validateApiKey(import.meta.env.VITE_SUPABASE_URL, 'Supabase URL', !isDev);
    validateApiKey(import.meta.env.VITE_SUPABASE_ANON_KEY, 'Supabase Anon Key', !isDev);

    // Validate Google Search (optional in dev mode)
    validateApiKey(import.meta.env.VITE_GOOGLE_API_KEY, 'Google API', !isDev);
    validateApiKey(import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID, 'Google Search Engine', !isDev);

    return {
      hf,
      isInitialized: isDev || !!hf
    };
  } catch (error) {
    console.warn('Service initialization failed:', error);
    // In development, always return a functioning state
    return {
      hf: import.meta.env.DEV ? {
        textGeneration: async () => ({ generated_text: 'Mock response after error recovery.' }),
        featureExtraction: async () => [[0.1, 0.2, 0.3]] // Mock embeddings
      } : null,
      isInitialized: import.meta.env.DEV
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
  
  // Only validate API key in production
  if (import.meta.env.PROD) {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API key' });
    }
  }

  next();
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
