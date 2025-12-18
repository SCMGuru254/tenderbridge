// Minimal rate limiting helper for Edge Functions.
// Implemented here because middleware/security.ts imports it.

export type RateLimitHeaders = Record<string, string>;

export type RateLimitResponse = {
  success: boolean;
  headers: RateLimitHeaders;
};

function buildHeaders(limit: number, remaining: number, resetMs: number): RateLimitHeaders {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(resetMs),
  };
}

// NOTE: This is a lightweight in-memory limiter per edge instance.
// For strong global limiting, rely on the Upstash limiter in _shared/rateLimiter.ts.
const buckets = new Map<string, { count: number; resetAt: number }>();

async function inMemoryLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResponse> {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, headers: buildHeaders(limit, limit - 1, resetAt) };
  }

  existing.count += 1;
  buckets.set(key, existing);

  const remaining = limit - existing.count;
  return {
    success: remaining >= 0,
    headers: buildHeaders(limit, remaining, existing.resetAt),
  };
}

export const checkRateLimit = (identifier: string) => inMemoryLimit(`default:${identifier}`, 120, 60_000);
export const authRateLimit = (identifier: string) => inMemoryLimit(`auth:${identifier}`, 20, 60_000);
