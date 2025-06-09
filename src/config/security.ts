
export const SECURITY_CONFIG = {
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: 5,
    API_REQUESTS_PER_MINUTE: 60,
    UPLOAD_REQUESTS_PER_HOUR: 10
  },
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },
  SESSION: {
    TIMEOUT_MINUTES: 30,
    REFRESH_THRESHOLD_MINUTES: 5
  },
  FILE_UPLOAD: {
    MAX_SIZE_MB: 10,
    ALLOWED_TYPES: ['pdf', 'doc', 'docx', 'txt'],
    SCAN_FOR_MALWARE: true
  },
  CONTENT_SECURITY: {
    XSS_PROTECTION: true,
    CSRF_PROTECTION: true,
    SQL_INJECTION_PROTECTION: true
  },
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_ROTATION_DAYS: 90
  },
  AUDIT: {
    LOG_ALL_ACTIONS: true,
    RETENTION_DAYS: 365,
    ALERT_ON_SUSPICIOUS_ACTIVITY: true
  }
};

export const validateSecurityCompliance = (data: any): boolean => {
  try {
    // Input validation
    if (typeof data !== 'object' || data === null) {
      return false;
    }
    
    // Check for common security threats
    const stringData = JSON.stringify(data);
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /exec\s*\(/i
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(stringData));
  } catch (error) {
    console.error('Security validation error:', error);
    return false;
  }
};

export const generateSecurityToken = (): string => {
  const timestamp = Date.now();
  const randomValue = Math.random().toString(36).substring(2);
  return btoa(`${timestamp}-${randomValue}`);
};
