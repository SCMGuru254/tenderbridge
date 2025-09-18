import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { RateLimit } from '@/types/anonymous';

// Cache for rate limiting
const rateLimitCache = new Map<string, { points: number; expires: number }>();

// Generate secure anonymous identifier
export const generateAnonymousId = (): string => {
  return uuidv4();
};

// Create secure hash of user ID for anonymous tracking
export const createSecureUserHash = (userId: string): string => {
  return createHash('sha256')
    .update(userId + process.env.VITE_ANONYMOUS_SECRET)
    .digest('hex');
};

// Generate random anonymous display name
export const generateAnonymousName = (): string => {
  const adjectives = ['Curious', 'Bright', 'Swift', 'Clever', 'Wise'];
  const nouns = ['Explorer', 'Thinker', 'Professional', 'Expert', 'Contributor'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  
  return `${adj}${noun}${num}`;
};

// Rate limiting function
export const checkRateLimit = async (
  key: string,
  limit: RateLimit
): Promise<boolean> => {
  const now = Date.now();
  const cached = rateLimitCache.get(key);

  if (cached) {
    if (now > cached.expires) {
      rateLimitCache.delete(key);
    } else if (cached.points >= limit.points) {
      return false;
    }
  }

  const current = cached || { points: 0, expires: now + (limit.duration * 1000) };
  current.points += 1;
  rateLimitCache.set(key, current);

  return true;
};

// Validate anonymous content
export const validateAnonymousContent = (content: string): boolean => {
  // Check for potentially identifying information
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+\d{1,3}[\s-]?)?\d{3}[\s-]?\d{3}[\s-]?\d{4}/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return !emailRegex.test(content) && 
         !phoneRegex.test(content) && 
         !urlRegex.test(content);
};

// Clean sensitive data from anonymous content
export const sanitizeAnonymousContent = (content: string): string => {
  return content
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REMOVED]')
    .replace(/(\+\d{1,3}[\s-]?)?\d{3}[\s-]?\d{3}[\s-]?\d{4}/g, '[PHONE REMOVED]')
    .replace(/(https?:\/\/[^\s]+)/g, '[URL REMOVED]');
};