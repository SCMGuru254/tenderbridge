import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || ''
});

// Different rate limiters for different purposes
export const rateLimiters = {
  api: new Ratelimit({
    redis,
    analytics: true,
    prefix: "api",
    limiter: Ratelimit.slidingWindow(100, "1 h") // 100 requests per hour
  }),
  
  socialMedia: new Ratelimit({
    redis,
    analytics: true,
    prefix: "social",
    limiter: Ratelimit.slidingWindow(30, "1 h") // 30 posts per hour
  }),

  // Keep existing login rate limiting
  auth: {
    MAX_ATTEMPTS: 5,
    TIME_WINDOW: 5 * 60 * 1000, // 5 minutes
    BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes
  }
};

// Existing auth rate limiting code stays the same
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blocked: boolean;
  blockExpires?: number;
}

const attempts: Map<string, AttemptRecord> = new Map();

/**
 * Check if an action from a specific identifier should be rate limited
 * @param identifier Unique identifier like IP address or user ID
 * @returns Whether the action should be blocked and when block expires
 */
export function checkRateLimit(identifier: string): { 
  blocked: boolean; 
  attemptsLeft: number;
  blockExpires?: Date;
} {
  const now = Date.now();
  const record = attempts.get(identifier);
  
  // No record exists yet
  if (!record) {
    attempts.set(identifier, { 
      count: 1, 
      firstAttempt: now,
      blocked: false
    });
    return { blocked: false, attemptsLeft: rateLimiters.auth.MAX_ATTEMPTS - 1 };
  }
  
  // Check if currently blocked
  if (record.blocked) {
    if (record.blockExpires && now > record.blockExpires) {
      // Block expired, reset record
      attempts.set(identifier, { 
        count: 1, 
        firstAttempt: now,
        blocked: false 
      });
      return { blocked: false, attemptsLeft: rateLimiters.auth.MAX_ATTEMPTS - 1 };
    }
    
    // Still blocked
    return { 
      blocked: true, 
      attemptsLeft: 0,
      blockExpires: record.blockExpires ? new Date(record.blockExpires) : undefined
    };
  }
  
  // Check if we should reset the window (time window expired)
  if (now - record.firstAttempt > rateLimiters.auth.TIME_WINDOW) {
    attempts.set(identifier, { 
      count: 1, 
      firstAttempt: now,
      blocked: false 
    });
    return { blocked: false, attemptsLeft: rateLimiters.auth.MAX_ATTEMPTS - 1 };
  }
  
  // Increment attempt count
  const newCount = record.count + 1;
  
  // Check if we've exceeded max attempts
  if (newCount > rateLimiters.auth.MAX_ATTEMPTS) {
    const blockExpires = now + rateLimiters.auth.BLOCK_DURATION;
    attempts.set(identifier, { 
      ...record, 
      count: newCount,
      blocked: true,
      blockExpires 
    });
    
    return { 
      blocked: true, 
      attemptsLeft: 0,
      blockExpires: new Date(blockExpires)
    };
  }
  
  // Update record
  attempts.set(identifier, { 
    ...record, 
    count: newCount
  });
  
  return { 
    blocked: false, 
    attemptsLeft: rateLimiters.auth.MAX_ATTEMPTS - newCount
  };
}

/**
 * Reset rate limiting for a specific identifier
 * Used when an action is successful (e.g. successful login)
 */
export function resetRateLimiter(identifier: string): void {
  attempts.delete(identifier);
}

// Cleanup function to prevent memory leaks
// In a real app, this would run on a timer
export function cleanupExpiredRateLimits(): void {
  const now = Date.now();
  
  for (const [key, record] of attempts.entries()) {
    // Remove expired blocks
    if (record.blocked && record.blockExpires && now > record.blockExpires) {
      attempts.delete(key);
    }
    // Remove expired time windows
    else if (!record.blocked && now - record.firstAttempt > rateLimiters.auth.TIME_WINDOW) {
      attempts.delete(key);
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredRateLimits, 10 * 60 * 1000);
