import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { RATE_LIMIT_CONFIG } from './securityConstants';

type RateLimitKey = keyof typeof RATE_LIMIT_CONFIG;

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export class EnhancedRateLimiter {
  private redis: Redis;
  private limiters: Map<RateLimitKey, Ratelimit> = new Map();

  constructor() {
    this.redis = Redis.fromEnv();
    this.initializeLimiters();
  }

  private getDurationInMs(durationStr: string): number {
    const [value, unit] = durationStr.split(' ');
    const timeValue = parseInt(value);
    switch (unit) {
      case 's':
        return timeValue * 1000;
      case 'm':
        return timeValue * 60 * 1000;
      case 'h':
        return timeValue * 60 * 60 * 1000;
      case 'd':
        return timeValue * 24 * 60 * 60 * 1000;
      default:
        return timeValue; // assume milliseconds
    }
  }

  private initializeLimiters() {
    // Initialize rate limiters for different endpoints/actions
    (Object.entries(RATE_LIMIT_CONFIG) as [RateLimitKey, typeof RATE_LIMIT_CONFIG[RateLimitKey]][]).forEach(([key, config]) => {
      const durationMs = this.getDurationInMs(config.duration);
      
      this.limiters.set(key, new Ratelimit({
        redis: this.redis,
        limiter: Ratelimit.slidingWindow(config.points, `${durationMs}ms`),
        analytics: true,
        prefix: `ratelimit:${key.toLowerCase()}`,
      }));
    });
  }

  async checkLimit(key: RateLimitKey, identifier: string): Promise<RateLimitResult> {
    const limiter = this.limiters.get(key);
    if (!limiter) {
      // Fall back to default limiter if specific one not found
      const defaultLimiter = this.limiters.get('DEFAULT');
      if (!defaultLimiter) {
        return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
      }
      return this.processLimit(defaultLimiter, identifier);
    }
    return this.processLimit(limiter, identifier);
  }

  private async processLimit(limiter: Ratelimit, identifier: string): Promise<RateLimitResult> {
    try {
      const result = await limiter.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open is usually not recommended for security features,
      // but in this case a temporary failure shouldn't block all users
      return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
    }
  }

  // Get current rate limit status without incrementing
  async getRateLimitStatus(key: RateLimitKey, identifier: string): Promise<RateLimitResult> {
    const limiter = this.limiters.get(key);
    if (!limiter) {
      return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
    }

    try {
      const result = await this.redis.get(`ratelimit:${key.toLowerCase()}:${identifier}`);
      if (!result) {
        return {
          success: true,
          limit: RATE_LIMIT_CONFIG[key].points,
          remaining: RATE_LIMIT_CONFIG[key].points,
          reset: 0,
        };
      }
      const { remaining, reset } = JSON.parse(result as string);
      return {
        success: remaining > 0,
        limit: RATE_LIMIT_CONFIG[key].points,
        remaining,
        reset,
      };
    } catch (error) {
      console.error('Failed to get rate limit status:', error);
      return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
    }
  }
}

export const rateLimiter = new EnhancedRateLimiter();
