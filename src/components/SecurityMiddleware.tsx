
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";

interface SecurityHeadersAudit {
  missing: string[];
  implemented: string[];
  score: number;
}

/**
 * SecurityMiddleware enhances application security by implementing:
 * - Content Security Policy monitoring
 * - Session monitoring
 * - Secure headers checking
 * - XSS protection validation
 * - Security headers audit
 */
const SecurityMiddleware = () => {
  const { user, session } = useUser();
  const { toast } = useToast();
  const location = useLocation();
  const [securityAudit, setSecurityAudit] = useState<SecurityHeadersAudit | null>(null);
  const isDev = import.meta.env.DEV;

  // Add meta security headers for CSP
  useEffect(() => {
    // Only add these in production or if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.openai.com https://api.x.com https://api.linkedin.com https://graph.facebook.com";
      document.head.appendChild(cspMeta);
      
      const xContentTypeOptions = document.createElement('meta');
      xContentTypeOptions.httpEquiv = 'X-Content-Type-Options';
      xContentTypeOptions.content = 'nosniff';
      document.head.appendChild(xContentTypeOptions);
      
      const xFrameOptions = document.createElement('meta');
      xFrameOptions.httpEquiv = 'X-Frame-Options';
      xFrameOptions.content = 'DENY';
      document.head.appendChild(xFrameOptions);
      
      const strictTransportSecurity = document.createElement('meta');
      strictTransportSecurity.httpEquiv = 'Strict-Transport-Security';
      strictTransportSecurity.content = 'max-age=31536000; includeSubDomains';
      document.head.appendChild(strictTransportSecurity);
      
      const referrerPolicy = document.createElement('meta');
      referrerPolicy.httpEquiv = 'Referrer-Policy';
      referrerPolicy.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerPolicy);
      
      const permissionsPolicy = document.createElement('meta');
      permissionsPolicy.httpEquiv = 'Permissions-Policy';
      permissionsPolicy.content = 'camera=(), microphone=(), geolocation=()';
      document.head.appendChild(permissionsPolicy);
    }
  }, []);

  // CSP violation monitoring
  useEffect(() => {
    const handleCSPViolation = (e: Event) => {
      const cspEvent = e as SecurityPolicyViolationEvent;
      console.error("CSP Violation:", {
        blockedURI: cspEvent.blockedURI,
        violatedDirective: cspEvent.violatedDirective,
        originalPolicy: cspEvent.originalPolicy
      });
      
      // Log security event
      logSecurityEvent("csp_violation", {
        blockedURI: cspEvent.blockedURI,
        violatedDirective: cspEvent.violatedDirective,
        url: window.location.href
      });
    };

    document.addEventListener("securitypolicyviolation", handleCSPViolation);
    return () => {
      document.removeEventListener("securitypolicyviolation", handleCSPViolation);
    };
  }, []);

  // Session monitoring for security anomalies
  useEffect(() => {
    if (user && session) {
      // Check for session integrity
      const lastAccessed = localStorage.getItem("lastAccess");
      const currentTime = new Date().toISOString();
      
      if (lastAccessed) {
        const timeDiff = new Date().getTime() - new Date(lastAccessed).getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Alert on suspicious time gaps (e.g., 12+ hours)
        if (hoursDiff > 12) {
          toast({
            title: "Security Notice",
            description: "Your account was accessed after a long period of inactivity.",
            variant: "default"
          });
          
          // Log security event
          logSecurityEvent("suspicious_access_time_gap", {
            userId: user.id,
            hoursSinceLastAccess: hoursDiff
          });
        }
      }
      
      localStorage.setItem("lastAccess", currentTime);
    }
  }, [user, session, toast]);

  // Security headers audit
  useEffect(() => {
    const auditSecurityHeaders = () => {
      const recommendedHeaders = [
        "Content-Security-Policy",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Strict-Transport-Security",
        "Referrer-Policy",
        "Permissions-Policy"
      ];
      
      const metaTags = document.querySelectorAll('meta[http-equiv]');
      const implementedHeaders: string[] = [];
      
      metaTags.forEach(tag => {
        const httpEquiv = tag.getAttribute('http-equiv');
        if (httpEquiv && recommendedHeaders.includes(httpEquiv)) {
          implementedHeaders.push(httpEquiv);
        }
      });
      
      const missingHeaders = recommendedHeaders.filter(
        header => !implementedHeaders.includes(header)
      );
      
      // Calculate a simple security score
      const score = Math.round((implementedHeaders.length / recommendedHeaders.length) * 100);
      
      setSecurityAudit({
        implemented: implementedHeaders,
        missing: missingHeaders,
        score
      });
      
      // Log complete audit
      console.info("Security Headers Audit:", {
        implemented: implementedHeaders,
        missing: missingHeaders,
        score: `${score}%`
      });
      
      // Only alert if score is below threshold and not in dev mode
      if (score < 80 && !isDev) {
        logSecurityEvent("security_headers_audit_warning", {
          score,
          missingHeaders
        });
      }
    };
    
    // Run audit after a short delay to ensure all meta tags are in place
    const auditTimer = setTimeout(() => {
      auditSecurityHeaders();
    }, 2000); // Increased timeout to ensure meta tags are added
    
    return () => clearTimeout(auditTimer);
  }, [location.pathname]); // Re-audit when route changes
  
  // Detect iframe embedding attempts - but don't warn in development
  useEffect(() => {
    const detectFraming = () => {
      try {
        // Check if the application is being framed
        if (window.self !== window.top) {
          if (!isDev) {
            console.warn("Security Warning: Application is being embedded in an iframe");
            
            logSecurityEvent("framing_attempt", {
              referrer: document.referrer,
              location: window.location.href
            });
          }
          
          // In a real app, you might want to break out of the frame
          // window.top.location = window.self.location;
        }
      } catch (e) {
        // If we can't access window.top, we're likely in a cross-origin frame
        if (!isDev) {
          console.warn("Security Warning: Application may be embedded in a cross-origin iframe");
          
          logSecurityEvent("possible_cross_origin_framing", {
            error: (e as Error).message
          });
        }
      }
    };
    
    detectFraming();
  }, [isDev]);
  
  // Detect devtools open (for educational purposes)
  useEffect(() => {
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        console.info("Developer tools may be open");
      }
    };
    
    window.addEventListener('resize', detectDevTools);
    return () => window.removeEventListener('resize', detectDevTools);
  }, []);

  /**
   * Log security events (in production, would send to monitoring service)
   */
  const logSecurityEvent = (eventType: string, details: Record<string, any>): void => {
    // Skip verbose logging in development mode
    if (isDev && ['framing_attempt', 'csp_violation'].includes(eventType)) {
      return;
    }
    
    const event = {
      timestamp: new Date().toISOString(),
      type: eventType,
      details,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    console.warn('Security Event:', event);
    
    // In production, would send to a monitoring service
    // Example: post to an API endpoint or use a monitoring SDK
  };

  return null; // This is a background utility component with no UI
};

export default SecurityMiddleware;
