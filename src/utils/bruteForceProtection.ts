import { rateLimiter } from './rateLimiter';
import { Redis } from '@upstash/redis';

interface BlockedIP {
  attempts: number;
  blockedUntil: number;
}

export class BruteForceProtection {
  private redis: Redis;
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  private readonly ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.redis = Redis.fromEnv();
  }

  private getBlockKey(ip: string, action: string): string {
    return `bruteforce:${action}:${ip}`;
  }

  async recordFailedAttempt(ip: string, action: string): Promise<void> {
    const key = this.getBlockKey(ip, action);
    const blockData = await this.redis.get<BlockedIP>(key);

    if (!blockData) {
      // First failed attempt
      await this.redis.set(key, {
        attempts: 1,
        blockedUntil: Date.now() + this.ATTEMPT_WINDOW_MS,
      }, { ex: Math.ceil(this.ATTEMPT_WINDOW_MS / 1000) });
      return;
    }

    const attempts = blockData.attempts + 1;
    if (attempts >= this.MAX_ATTEMPTS) {
      // Too many failures, block the IP
      await this.redis.set(key, {
        attempts,
        blockedUntil: Date.now() + this.BLOCK_DURATION_MS,
      }, { ex: Math.ceil(this.BLOCK_DURATION_MS / 1000) });
    } else {
      // Update attempt count
      await this.redis.set(key, {
        attempts,
        blockedUntil: blockData.blockedUntil,
      }, { ex: Math.ceil((blockData.blockedUntil - Date.now()) / 1000) });
    }
  }

  async resetAttempts(ip: string, action: string): Promise<void> {
    const key = this.getBlockKey(ip, action);
    await this.redis.del(key);
  }

  async isBlocked(ip: string, action: string): Promise<{ blocked: boolean; remainingMs: number }> {
    const key = this.getBlockKey(ip, action);
    const blockData = await this.redis.get<BlockedIP>(key);

    if (!blockData) {
      return { blocked: false, remainingMs: 0 };
    }

    const now = Date.now();
    if (blockData.attempts >= this.MAX_ATTEMPTS && now < blockData.blockedUntil) {
      return { blocked: true, remainingMs: blockData.blockedUntil - now };
    }

    // If window has expired, clean up the record
    if (now > blockData.blockedUntil) {
      await this.redis.del(key);
    }

    return { blocked: false, remainingMs: 0 };
  }

  async checkAttempts(ip: string, action: string): Promise<number> {
    const key = this.getBlockKey(ip, action);
    const blockData = await this.redis.get<BlockedIP>(key);
    return blockData?.attempts || 0;
  }
}

export const bruteForceProtection = new BruteForceProtection();
