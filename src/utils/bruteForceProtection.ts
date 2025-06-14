
// Brute force protection utilities
const attemptMap = new Map<string, { count: number; lastAttempt: number; blockUntil?: number }>();

export const checkRateLimit = (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const record = attemptMap.get(identifier);
  
  if (!record) {
    attemptMap.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (record.blockUntil && now < record.blockUntil) {
    return false;
  }
  
  if (now - record.lastAttempt > windowMs) {
    attemptMap.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  record.count++;
  record.lastAttempt = now;
  
  if (record.count > maxAttempts) {
    record.blockUntil = now + windowMs;
    return false;
  }
  
  return true;
};
