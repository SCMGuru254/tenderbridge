// Mobile-friendly rate limiter using local storage
class MobileRateLimiter {
  private prefix: string;
  private maxRequests: number;
  private window: number; // in milliseconds

  constructor(options: { prefix: string; limit: number; window: number }) {
    this.prefix = options.prefix;
    this.maxRequests = options.limit;
    this.window = options.window;
  }

  private getStorageKey(identifier: string): string {
    return `${this.prefix}:${identifier}`;
  }

  async limit(identifier: string) {
    const key = this.getStorageKey(identifier);
    const now = Date.now();
    
    // Get existing record from local storage
    const stored = localStorage.getItem(key);
    let record = stored ? JSON.parse(stored) : { count: 0, resetAt: now + this.window };
    
    // Reset if window has passed
    if (now > record.resetAt) {
      record = { count: 0, resetAt: now + this.window };
    }

    // Increment count
    record.count++;
    localStorage.setItem(key, JSON.stringify(record));

    return {
      success: record.count <= this.maxRequests,
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - record.count),
      reset: record.resetAt
    };
  }
}

// Simplified rate limiters for mobile
export const rateLimiters = {
  api: {
    async getInstance() {
      return new MobileRateLimiter({
        prefix: "api",
        limit: 100,
        window: 60 * 60 * 1000 // 1 hour
      });
    }
  },
  
  socialMedia: {
    async getInstance() {
      return new MobileRateLimiter({
        prefix: "social",
        limit: 30,
        window: 60 * 60 * 1000 // 1 hour
      });
    }
  },

  // Simplified auth rate limiting
  auth: {
    MAX_ATTEMPTS: 5,
    TIME_WINDOW: 5 * 60 * 1000, // 5 minutes
    BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes
  }
};

// Mobile-friendly auth rate limiting
export function checkRateLimit(identifier: string): { 
  blocked: boolean; 
  attemptsLeft: number;
  blockExpires?: Date;
} {
  const key = `auth:${identifier}`;
  const now = Date.now();
  
  const stored = localStorage.getItem(key);
  let record = stored ? JSON.parse(stored) : { 
    count: 0, 
    firstAttempt: now,
    blocked: false 
  };

  // Check if blocked
  if (record.blocked) {
    if (record.blockExpires && now > record.blockExpires) {
      record = { count: 1, firstAttempt: now, blocked: false };
      localStorage.setItem(key, JSON.stringify(record));
      return { blocked: false, attemptsLeft: rateLimiters.auth.MAX_ATTEMPTS - 1 };
    }
    return { 
      blocked: true, 
      attemptsLeft: 0,
      blockExpires: record.blockExpires ? new Date(record.blockExpires) : undefined
    };
  }

  // Check time window
  if (now - record.firstAttempt > rateLimiters.auth.TIME_WINDOW) {
    record = { count: 1, firstAttempt: now, blocked: false };
  } else {
    record.count++;
    if (record.count >= rateLimiters.auth.MAX_ATTEMPTS) {
      record.blocked = true;
      record.blockExpires = now + rateLimiters.auth.BLOCK_DURATION;
    }
  }

  localStorage.setItem(key, JSON.stringify(record));
  
  return {
    blocked: record.blocked,
    attemptsLeft: Math.max(0, rateLimiters.auth.MAX_ATTEMPTS - record.count),
    blockExpires: record.blockExpires ? new Date(record.blockExpires) : undefined
  };
}

export function resetRateLimiter(identifier: string): void {
  localStorage.removeItem(`auth:${identifier}`);
}

export function cleanupExpiredRateLimits(): void {
  const now = Date.now();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('auth:') || key?.startsWith('api:') || key?.startsWith('social:')) {
      const stored = localStorage.getItem(key);
      if (stored) {
        const record = JSON.parse(stored);
        if (record.blockExpires && now > record.blockExpires) {
          localStorage.removeItem(key);
        }
      }
    }
  }
}
