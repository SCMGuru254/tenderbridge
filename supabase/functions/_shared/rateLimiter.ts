import { Redis } from 'https://esm.sh/@upstash/redis@1.20.4'
import { Ratelimit } from 'https://esm.sh/@upstash/ratelimit@0.4.3'
import { RATE_LIMIT_CONFIG } from './securityConstants.ts'

type RateLimitKey = keyof typeof RATE_LIMIT_CONFIG;

type UpstashDurationUnit = 'ms' | 's' | 'm' | 'h' | 'd';

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

function parseUpstashDuration(input: string): `${number} ${UpstashDurationUnit}` {
  const parts = input.trim().split(/\s+/);
  const value = Number(parts[0]);
  const unit = parts[1] as UpstashDurationUnit | undefined;

  const safeValue = Number.isFinite(value) && value > 0 ? value : 60;
  const safeUnit: UpstashDurationUnit = unit && ['ms', 's', 'm', 'h', 'd'].includes(unit) ? unit : 's';

  return `${safeValue} ${safeUnit}`;
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
      const duration = parseUpstashDuration(config.duration);

      this.limiters.set(
        key as RateLimitKey,
        new Ratelimit({
          redis: this.redis,
          limiter: Ratelimit.slidingWindow(config.points, duration),
          analytics: true,
          prefix: `ratelimit:${key.toLowerCase()}`,
        })
      );
    });
  }

  async checkLimit(key: RateLimitKey, identifier: string): Promise<RateLimitResult> {
    const limiter = this.limiters.get(key) ?? this.limiters.get('DEFAULT');
    if (!limiter) return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
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

