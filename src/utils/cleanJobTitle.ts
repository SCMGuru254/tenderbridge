
// Enhanced utility to clean job titles and remove ALL placeholder/mock data
export const cleanJobTitle = (title: string): string => {
  if (!title || typeof title !== 'string') return '';
  
  // Remove CDATA tags and their content markers
  let cleaned = title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  
  // Remove any remaining XML/HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace and normalize
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  // Remove any remaining brackets or special characters that might be artifacts
  cleaned = cleaned.replace(/[\[\]<>]/g, '');
  
  // STRICT RULES: Reject any placeholder or mock data
  const invalidPatterns = [
    /^\*+$/,                          // Only asterisks
    /^\*+\s*\*+$/,                    // Multiple asterisk groups
    /\*{3,}/,                         // 3 or more consecutive asterisks
    /^[\*\-\s]+$/,                    // Only asterisks, dashes, and spaces
    /^\s*[\*\-]+\s*[\(\)]*\s*$/,     // Asterisks/dashes with optional parentheses
    /^null$/i,                        // literal "null"
    /^undefined$/i,                   // literal "undefined"
    /^[\s\-\(\)]*$/,                  // Only spaces, dashes, parentheses
    /^[\*]{2,}/,                      // Two or more asterisks anywhere
    /\*+.*\*+/,                       // Asterisks at beginning and end
  ];
  
  // Check against invalid patterns
  for (const pattern of invalidPatterns) {
    if (pattern.test(cleaned)) {
      console.log(`🚫 Rejected invalid title: "${title}" -> "${cleaned}"`);
      return '';
    }
  }
  
  // Additional validation: must have actual letters
  if (!/[a-zA-Z]{3,}/.test(cleaned)) {
    console.log(`🚫 Rejected title without sufficient letters: "${cleaned}"`);
    return '';
  }
  
  // Must be at least 3 characters and contain meaningful content
  if (cleaned.length < 3) {
    console.log(`🚫 Rejected too short title: "${cleaned}"`);
    return '';
  }
  
  return cleaned;
};

// Enhanced company name cleaning with strict validation
export const cleanCompanyName = (company: string): string => {
  if (!company || typeof company !== 'string') return '';
  
  let cleaned = company.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  // STRICT RULES: Reject placeholder data for companies
  const invalidPatterns = [
    /^\*+$/,                          // Only asterisks
    /\*{2,}/,                         // Two or more consecutive asterisks
    /^[\*\-\s]+$/,                    // Only asterisks, dashes, and spaces
    /^\s*[\*\-]+\s*[\(\)]*\s*$/,     // Asterisks/dashes with optional parentheses
    /^null$/i,                        // literal "null"
    /^undefined$/i,                   // literal "undefined"
    /^[\s\-\(\)]*$/,                  // Only spaces, dashes, parentheses
    /\*+.*\*+/,                       // Asterisks at beginning and end
    /^Company\s*not\s*specified$/i,   // Generic placeholder
  ];
  
  // Check against invalid patterns
  for (const pattern of invalidPatterns) {
    if (pattern.test(cleaned)) {
      console.log(`🚫 Rejected invalid company: "${company}" -> "${cleaned}"`);
      return '';
    }
  }
  
  // Must have actual letters
  if (!/[a-zA-Z]{2,}/.test(cleaned)) {
    console.log(`🚫 Rejected company without sufficient letters: "${cleaned}"`);
    return '';
  }
  
  // Must be at least 2 characters
  if (cleaned.length < 2) {
    console.log(`🚫 Rejected too short company: "${cleaned}"`);
    return '';
  }
  
  return cleaned;
};

// Enhanced location cleaning
export const cleanLocation = (location: string): string => {
  if (!location || typeof location !== 'string') return '';
  
  let cleaned = location.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  // STRICT RULES: Reject placeholder data for locations
  const invalidPatterns = [
    /^\*+$/,                          
    /\*{2,}/,                         
    /^[\*\-\s]+$/,                    
    /^\s*[\*\-]+\s*[\(\)]*\s*$/,     
    /^null$/i,                        
    /^undefined$/i,                   
    /^[\s\-\(\)]*$/,                  
    /\*+.*\*+/,                       
  ];
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(cleaned)) {
      console.log(`🚫 Rejected invalid location: "${location}" -> "${cleaned}"`);
      return '';
    }
  }
  
  // Must have actual letters
  if (!/[a-zA-Z]{2,}/.test(cleaned)) {
    return '';
  }
  
  if (cleaned.length < 2) {
    return '';
  }
  
  return cleaned;
};

// Enhanced description cleaning
export const cleanJobDescription = (description: string): string => {
  if (!description || typeof description !== 'string') return '';
  
  // Remove CDATA tags
  let cleaned = description.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  
  // Remove script and style tags completely
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Convert common HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#39;/g, "'");
  
  // Remove HTML tags but preserve line breaks
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.trim();
  
  // STRICT RULES: Reject placeholder descriptions
  const invalidPatterns = [
    /^\*+$/,
    /\*{3,}/,
    /^[\*\-\s]+$/,
    /^null$/i,
    /^undefined$/i,
  ];
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(cleaned)) {
      return '';
    }
  }
  
  // Must have meaningful content
  if (cleaned.length < 10 || !/[a-zA-Z]{5,}/.test(cleaned)) {
    return '';
  }
  
  return cleaned;
};
