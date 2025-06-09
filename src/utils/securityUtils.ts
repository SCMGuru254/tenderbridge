
// Security utilities
export const applySecurityHeaders = () => {
  // Apply meta tags for security
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!metaCSP) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:";
    document.head.appendChild(meta);
  }
};

// Simple rate limiter for client-side
class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();

  checkLimit(key: string, maxRequests: number, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new ClientRateLimiter();

// Security audit function
export const securityAudit = () => {
  const issues: string[] = [];
  
  // Check for HTTPS
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    issues.push('Site not served over HTTPS');
  }
  
  // Check for secure headers
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    issues.push('Missing Content Security Policy');
  }
  
  return {
    issues,
    score: Math.max(0, 100 - (issues.length * 20))
  };
};
