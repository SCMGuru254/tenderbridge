// Create a fallback in-memory rate limiter for development
class InMemoryRateLimiter {
  private prefix: string;
  private limit: number;
  private window: string;
  private records: Map<string, { count: number; resetAt: number }>;

  constructor(options: any) {
    this.prefix = options.prefix || '';
    this.limit = options.limiter?.limit || 100;
    this.window = options.limiter?.window || '1 h';
    this.records = new Map();
  }

  static slidingWindow(limit: number, window: string) {
    return { limit, window };
  }

  async limit(identifier: string) {
    const now = Date.now();
    const key = `${this.prefix}:${identifier}`;
    const record = this.records.get(key) || { count: 0, resetAt: now + this.parseWindow(this.window) };
    
    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + this.parseWindow(this.window);
    }

    record.count++;
    this.records.set(key, record);
    
    return {
      success: record.count <= this.limit,
      limit: this.limit,
      remaining: Math.max(0, this.limit - record.count),
      reset: record.resetAt
    };
  }

  parseWindow(window: string) {
    const [amount, unit] = window.split(' ');
    switch (unit) {
      case 's': return parseInt(amount) * 1000;
      case 'm': return parseInt(amount) * 60 * 1000;
      case 'h': return parseInt(amount) * 60 * 60 * 1000;
      case 'd': return parseInt(amount) * 24 * 60 * 60 * 1000;
      default: return 60 * 60 * 1000; // Default 1 hour
    }
  }
}

// Define types for our dynamic imports
type RedisClientType = any;
type RatelimitType = any;

// Variables to store the dynamically imported classes
let RedisClient: RedisClientType | null = null;
let RatelimitClass: RatelimitType | InMemoryRateLimiter = InMemoryRateLimiter;

// Try to dynamically import the libraries without using static imports
const loadDependencies = async () => {
  try {
    // Dynamic imports to avoid the reassignment error
    const redisModule = await import('@upstash/redis');
    const ratelimitModule = await import('@upstash/ratelimit');
    
    RedisClient = redisModule.Redis;
    RatelimitClass = ratelimitModule.Ratelimit;
    return true;
  } catch (error) {
    console.warn('Upstash dependencies not available, using fallback rate limiter');
    return false;
  }
};

// Try to load dependencies immediately but don't block execution
loadDependencies();

// Initialize Redis client if credentials are available, otherwise use in-memory implementation
let redis: any = null;

// Setup function that can be called after dependencies are loaded
export const setupRateLimiters = async () => {
  if (!RedisClient && await loadDependencies() && RedisClient) {
    if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
      try {
        redis = new RedisClient({
          url: process.env.UPSTASH_REDIS_URL,
          token: process.env.UPSTASH_REDIS_TOKEN
        });
      } catch (error) {
        console.error('Failed to initialize Redis client:', error);
      }
    }
  }
};

// Different rate limiters for different purposes
export const rateLimiters = {
  api: {
    async getInstance() {
      await setupRateLimiters();
      return redis 
        ? new RatelimitClass({
            redis,
            analytics: true,
            prefix: "api",
            limiter: RatelimitClass.slidingWindow(100, "1 h") // 100 requests per hour
          })
        : new InMemoryRateLimiter({
            prefix: "api",
            limiter: InMemoryRateLimiter.slidingWindow(100, "1 h")
          });
    }
  },
  
  socialMedia: {
    async getInstance() {
      await setupRateLimiters();
      return redis
        ? new RatelimitClass({
            redis,
            analytics: true,
            prefix: "social",
            limiter: RatelimitClass.slidingWindow(30, "1 h") // 30 posts per hour
          })
        : new InMemoryRateLimiter({
            prefix: "social",
            limiter: InMemoryRateLimiter.slidingWindow(30, "1 h")
          });
    }
  },

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
