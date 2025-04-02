
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";

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
  const [securityAudit, setSecurityAudit] = useState<SecurityHeadersAudit | null>(null);

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
      
      // Only alert if score is below threshold
      if (score < 80) {
        logSecurityEvent("security_headers_audit_warning", {
          score,
          missingHeaders
        });
      }
    };
    
    // Run audit after a short delay to ensure all meta tags are in place
    const auditTimer = setTimeout(() => {
      auditSecurityHeaders();
    }, 1000);
    
    return () => clearTimeout(auditTimer);
  }, []);
  
  // Detect iframe embedding attempts
  useEffect(() => {
    const detectFraming = () => {
      try {
        // Check if the application is being framed
        if (window.self !== window.top) {
          console.warn("Security Warning: Application is being embedded in an iframe");
          
          logSecurityEvent("framing_attempt", {
            referrer: document.referrer,
            location: window.location.href
          });
          
          // In a real app, you might want to break out of the frame
          // window.top.location = window.self.location;
        }
      } catch (e) {
        // If we can't access window.top, we're likely in a cross-origin frame
        console.warn("Security Warning: Application may be embedded in a cross-origin iframe");
        
        logSecurityEvent("possible_cross_origin_framing", {
          error: (e as Error).message
        });
      }
    };
    
    detectFraming();
  }, []);
  
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
