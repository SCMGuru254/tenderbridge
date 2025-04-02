
/**
 * Sanitizes user input to prevent XSS attacks
 * @param input User-provided input string
 * @returns Sanitized string safe for rendering
 */
export function sanitizeInput(input: string): string {
  // Basic HTML sanitization
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates input against common injection patterns
 * @param input User input to validate
 * @param pattern Type of validation to perform
 * @returns Whether the input passes validation
 */
export function validateInput(input: string, pattern: 'email'|'name'|'search'|'url'): boolean {
  const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    name: /^[a-zA-Z0-9\s\-_.']{2,50}$/,
    search: /^[a-zA-Z0-9\s\-_.,!?@#%&*()]{0,100}$/,
    url: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/
  };
  
  return patterns[pattern].test(input);
}

/**
 * Generate a secure random token
 * @param length Length of the token
 * @returns Cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Encrypt data for local storage (simple version for demonstration)
 * In production, use a proper encryption library
 */
export function encryptForStorage(data: string, passkey: string): string {
  // This is a placeholder for educational purposes
  // In a real app, use a proper encryption library like CryptoJS
  return btoa(data) + '.' + generateSecureToken(8);
}

/**
 * Evaluate the strength of a password
 * @param password User password
 * @returns Score from 0-100 and feedback
 */
export function evaluatePasswordStrength(password: string): { 
  score: number, 
  feedback: string 
} {
  let score = 0;
  let feedback = 'Password is too weak';
  
  if (!password) return { score, feedback };
  
  // Length check
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  
  // Character type checks
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  
  // Variety check (unique characters)
  const uniqueChars = new Set(password).size;
  score += Math.min(10, uniqueChars / 2);
  
  // Provide feedback based on score
  if (score >= 90) feedback = 'Excellent password';
  else if (score >= 70) feedback = 'Good password';
  else if (score >= 40) feedback = 'Moderate password';
  else feedback = 'Weak password - consider making it stronger';
  
  return { score, feedback };
}

/**
 * Log security events (in production, would send to monitoring service)
 */
export function logSecurityEvent(eventType: string, details: Record<string, any>): void {
  const event = {
    timestamp: new Date().toISOString(),
    type: eventType,
    details
  };
  
  console.warn('Security Event:', event);
  
  // In production, would send to a monitoring service
}
