import { rateLimiter } from './rateLimiter';
import { bruteForceProtection } from './bruteForceProtection';
import { SECURITY_HEADERS } from './securityConstants';

type AuthAction = 'login' | 'signup' | 'password-reset' | 'mfa';

interface SecurityMiddlewareOptions {
  checkBruteForce?: boolean;
  authAction?: AuthAction;
  rateLimitKey?: string;
}

export async function securityMiddleware(
  req: Request,
  options: SecurityMiddlewareOptions = {}
): Promise<Response | null> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const rateLimitKey = options.rateLimitKey || 'DEFAULT';
  
  // Apply rate limiting
  const rateLimitResult = await rateLimiter.checkLimit(rateLimitKey as any, ip);
  if (!rateLimitResult.success) {
    return new Response('Too many requests', {
      status: 429,
      headers: {
        ...SECURITY_HEADERS,
        'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
      },
    });
  }

  // Check for brute force attempts if enabled and authAction is provided
  if (options.checkBruteForce && options.authAction) {
    const { blocked, remainingMs } = await bruteForceProtection.isBlocked(ip, options.authAction);
    if (blocked) {
      return new Response('Account locked due to too many failed attempts', {
        status: 423,
        headers: {
          ...SECURITY_HEADERS,
          'Retry-After': Math.ceil(remainingMs / 1000).toString(),
        },
      });
    }
  }

  // Apply security headers to all responses
  return null;
}

export async function handleFailedAuth(
  ip: string,
  action: AuthAction
): Promise<void> {
  await bruteForceProtection.recordFailedAttempt(ip, action);
}

export async function handleSuccessfulAuth(
  ip: string,
  action: AuthAction
): Promise<void> {
  await bruteForceProtection.resetAttempts(ip, action);
}

// Helper to apply security headers to any Response
export function applySecurityHeaders(response: Response): Response {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Helper to sanitize and validate input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/['"]/g, '') // Remove quotes to prevent quote injection
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(sanitizeInput(email));
}

export function validatePassword(password: string): { 
  valid: boolean; 
  message?: string;
} {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!hasUpperCase || !hasLowerCase) {
    return { valid: false, message: 'Password must contain both upper and lowercase letters' };
  }
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }

  return { valid: true };
}
