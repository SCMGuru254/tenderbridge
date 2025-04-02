
/**
 * Enhanced input validation utilities for security
 */

// Common validation patterns
const patterns = {
  // Only allow alphanumeric characters, spaces, and basic punctuation
  name: /^[a-zA-Z0-9\s\-_.']{2,50}$/,
  
  // Standard email format with TLD validation
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Allow alphanumeric characters, common punctuation with limits
  text: /^[a-zA-Z0-9\s\-_.,!?@#%&*()]{0,500}$/,
  
  // URLs must be properly formatted
  url: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/,
  
  // Phone numbers in various formats
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  
  // Password requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
  
  // Zip code (US format)
  zipcode: /^\d{5}(-\d{4})?$/,
  
  // LinkedIn URL format
  linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]{5,30}[a-zA-Z0-9]$/,
  
  // Date format (YYYY-MM-DD)
  date: /^\d{4}-\d{2}-\d{2}$/
};

type ValidationPattern = keyof typeof patterns;

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/&/g, '&amp;')
    .replace(/\\/g, '&#92;')
    .replace(/`/g, '&#96;');
}

/**
 * Validate input against specified pattern
 */
export function validateInput(input: string, pattern: ValidationPattern): boolean {
  if (!input) return false;
  return patterns[pattern].test(input);
}

/**
 * Validate and sanitize input in one step
 */
export function validateAndSanitize(
  input: string, 
  pattern: ValidationPattern
): { isValid: boolean; sanitized: string } {
  const sanitized = sanitizeInput(input);
  return {
    isValid: patterns[pattern].test(input),
    sanitized
  };
}

/**
 * Check for common SQL injection patterns
 */
export function hasSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /'\s*or\s*'1'='1/i,
    /;\s*drop\s+table/i,
    /union\s+select/i,
    /exec\s*\(/i,
    /--[^\n]*/i,
    /\/\*.*\*\//i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for common XSS attack patterns
 */
export function hasXssAttempt(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /on\w+\s*=/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Comprehensive validation that checks for common security issues
 */
export function secureValidate(
  input: string,
  pattern: ValidationPattern
): { 
  isValid: boolean; 
  sanitized: string; 
  securityIssues: string[];
} {
  const sanitized = sanitizeInput(input);
  const securityIssues = [];
  
  if (hasSqlInjection(input)) {
    securityIssues.push('Potential SQL injection detected');
  }
  
  if (hasXssAttempt(input)) {
    securityIssues.push('Potential XSS attack detected');
  }
  
  if (input.length > 1000) {
    securityIssues.push('Input exceeds maximum allowed length');
  }
  
  return {
    isValid: securityIssues.length === 0 && patterns[pattern].test(input),
    sanitized,
    securityIssues
  };
}

/**
 * Validate file uploads for security
 */
export function validateFileUpload(file: File, allowedTypes: string[], maxSizeMB: number): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  // Check file size
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds the ${maxSizeMB}MB limit`);
  }
  
  // Check file type
  const fileType = file.type;
  if (!allowedTypes.includes(fileType)) {
    errors.push('File type not allowed');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate PDF files (for CVs/resumes)
 */
export function validatePDFUpload(file: File): {
  isValid: boolean;
  errors: string[];
} {
  return validateFileUpload(file, ['application/pdf'], 5); // 5MB limit for PDFs
}

/**
 * Validate image files (for profile photos)
 */
export function validateImageUpload(file: File): {
  isValid: boolean;
  errors: string[];
} {
  return validateFileUpload(
    file, 
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    2 // 2MB limit for images
  );
}
