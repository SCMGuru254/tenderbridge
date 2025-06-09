
import { useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { SECURITY_CONFIG } from '@/config/security';
import { applySecurityHeaders, rateLimiter } from '@/utils/securityUtils';

interface SecurityMiddlewareProps {
  children: ReactNode;
}

const SecurityMiddleware = ({ children }: SecurityMiddlewareProps) => {
  useEffect(() => {
    // Apply security headers
    applySecurityHeaders();
    
    // Check rate limiting on page load
    if (!rateLimiter.checkLimit('page_load', 1)) {
      toast.error('Too many requests. Please slow down.');
    }

    // Content Security Policy violation handler
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      console.warn('CSP Violation:', event.violatedDirective, event.blockedURI);
      if (SECURITY_CONFIG.AUDIT.ALERT_ON_SUSPICIOUS_ACTIVITY) {
        // Report violation to monitoring service
        console.log('Reporting CSP violation to monitoring service');
      }
    };

    document.addEventListener('securitypolicyviolation', handleCSPViolation);
    
    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, []);

  return <>{children}</>;
};

export default SecurityMiddleware;
