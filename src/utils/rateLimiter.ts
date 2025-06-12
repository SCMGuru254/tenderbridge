
interface RateLimitConfig {
  windowSize: number; // in milliseconds
  maxRequests: number;
}

interface RequestLog {
  timestamp: number;
  count: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitConfig> = new Map();
  private requestLogs: Map<string, RequestLog[]> = new Map();

  constructor() {
    // Default rate limits
    this.limits.set('api_calls', { windowSize: 60000, maxRequests: 100 }); // 100 per minute
    this.limits.set('job_search', { windowSize: 10000, maxRequests: 10 }); // 10 per 10 seconds
    this.limits.set('news_fetch', { windowSize: 300000, maxRequests: 5 }); // 5 per 5 minutes
  }

  setLimit(key: string, config: RateLimitConfig): void {
    this.limits.set(key, config);
  }

  async checkLimit(key: string, identifier: string = 'default'): Promise<boolean> {
    const config = this.limits.get(key);
    if (!config) return true; // No limit configured

    const logKey = `${key}_${identifier}`;
    const now = Date.now();
    
    if (!this.requestLogs.has(logKey)) {
      this.requestLogs.set(logKey, []);
    }

    const logs = this.requestLogs.get(logKey)!;
    
    // Remove expired logs
    const validLogs = logs.filter(log => now - log.timestamp < config.windowSize);
    
    // Count total requests in the window
    const totalRequests = validLogs.reduce((sum, log) => sum + log.count, 0);
    
    if (totalRequests >= config.maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    validLogs.push({ timestamp: now, count: 1 });
    this.requestLogs.set(logKey, validLogs);
    
    return true;
  }

  getStoredItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  }

  setStoredItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error setting localStorage:', error);
    }
  }

  getRemainingRequests(key: string, identifier: string = 'default'): number {
    const config = this.limits.get(key);
    if (!config) return Infinity;

    const logKey = `${key}_${identifier}`;
    const now = Date.now();
    
    const logs = this.requestLogs.get(logKey) || [];
    const validLogs = logs.filter(log => now - log.timestamp < config.windowSize);
    const totalRequests = validLogs.reduce((sum, log) => sum + log.count, 0);
    
    return Math.max(0, config.maxRequests - totalRequests);
  }

  getTimeUntilReset(key: string, identifier: string = 'default'): number {
    const config = this.limits.get(key);
    if (!config) return 0;

    const logKey = `${key}_${identifier}`;
    const logs = this.requestLogs.get(logKey) || [];
    
    if (logs.length === 0) return 0;
    
    const oldestLog = logs[0];
    const resetTime = oldestLog.timestamp + config.windowSize;
    
    return Math.max(0, resetTime - Date.now());
  }
}

export const rateLimiter = new RateLimiter();
