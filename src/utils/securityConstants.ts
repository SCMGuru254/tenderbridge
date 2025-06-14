
export const RATE_LIMIT_CONFIG = {
  DEFAULT: {
    points: 100,
    duration: '15 m'
  },
  AUTH: {
    points: 5,
    duration: '15 m'
  },
  API: {
    points: 60,
    duration: '1 m'
  },
  profile_update: {
    points: 5,
    duration: '1 m'
  },
  track_activity: {
    points: 100,
    duration: '1 m'
  },
  connection_request: {
    points: 10,
    duration: '1 h'
  }
} as const;

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
