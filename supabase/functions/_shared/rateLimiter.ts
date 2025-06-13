import { Redis } from 'https://esm.sh/@upstash/redis@1.20.4'
import { Ratelimit } from 'https://esm.sh/@upstash/ratelimit@0.4.3'
import { RATE_LIMIT_CONFIG } from './securityConstants.ts'

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

  private initializeLimiters() {
    Object.entries(RATE_LIMIT_CONFIG).forEach(([key, config]) => {
      const duration = config.duration.split(' ');
      const timeValue = parseInt(duration[0]);
      const timeUnit = duration[1] as 'ms' | 's' | 'm' | 'h' | 'd';
      
      this.limiters.set(key as RateLimitKey, new Ratelimit({
        redis: this.redis,
        limiter: Ratelimit.slidingWindow(config.points, timeValue * this.getTimeUnitInMs(timeUnit)),
        analytics: true,
        prefix: `ratelimit:${key.toLowerCase()}`,
      }));
    });
  }

  private getTimeUnitInMs(unit: 'ms' | 's' | 'm' | 'h' | 'd'): number {
    switch (unit) {
      case 's':
        return 1000;
      case 'm':
        return 60 * 1000;
      case 'h':
        return 60 * 60 * 1000;
      case 'd':
        return 24 * 60 * 60 * 1000;
      default:
        return 1;
    }
  }

  async checkLimit(key: RateLimitKey, identifier: string): Promise<RateLimitResult> {
    const limiter = this.limiters.get(key);
    if (!limiter) {
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
      return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
    }
  }
}

export const rateLimiter = new EnhancedRateLimiter();
