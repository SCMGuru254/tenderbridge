
/**
 * A simple in-memory rate limiter to prevent brute force attacks
 * In production, this should be replaced with a Redis-based limiter
 */

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blocked: boolean;
  blockExpires?: number;
}

const attempts: Map<string, AttemptRecord> = new Map();

// Settings
const MAX_ATTEMPTS = 5; // Maximum attempts within time window
const TIME_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes block after too many attempts

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
    return { blocked: false, attemptsLeft: MAX_ATTEMPTS - 1 };
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
      return { blocked: false, attemptsLeft: MAX_ATTEMPTS - 1 };
    }
    
    // Still blocked
    return { 
      blocked: true, 
      attemptsLeft: 0,
      blockExpires: record.blockExpires ? new Date(record.blockExpires) : undefined
    };
  }
  
  // Check if we should reset the window (time window expired)
  if (now - record.firstAttempt > TIME_WINDOW) {
    attempts.set(identifier, { 
      count: 1, 
      firstAttempt: now,
      blocked: false 
    });
    return { blocked: false, attemptsLeft: MAX_ATTEMPTS - 1 };
  }
  
  // Increment attempt count
  const newCount = record.count + 1;
  
  // Check if we've exceeded max attempts
  if (newCount > MAX_ATTEMPTS) {
    const blockExpires = now + BLOCK_DURATION;
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
    attemptsLeft: MAX_ATTEMPTS - newCount
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
    else if (!record.blocked && now - record.firstAttempt > TIME_WINDOW) {
      attempts.delete(key);
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredRateLimits, 10 * 60 * 1000);
