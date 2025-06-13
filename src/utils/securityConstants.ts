export const RATE_LIMIT_CONFIG = {
  DEFAULT: {
    points: 10,
    duration: '10 s',
    blockDuration: '1 m'
  },
  AUTH: {
    points: 5,
    duration: '5 m',
    blockDuration: '15 m'
  },
  API: {
    points: 100,
    duration: '1 m',
    blockDuration: '5 m'
  }
};

export const SECURITY_HEADERS = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.paypal.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.supabase.co https://api.openai.com https://*.paypal.com; " +
    "frame-src 'self' https://*.paypal.com https://*.supabase.co; " +
    "object-src 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
