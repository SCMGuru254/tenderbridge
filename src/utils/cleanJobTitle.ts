
// Utility to clean job titles by removing CDATA tags and other unwanted elements
export const cleanJobTitle = (title: string): string => {
  if (!title) return '';
  
  // Remove CDATA tags and their content markers
  let cleaned = title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  
  // Remove any remaining XML/HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace and normalize
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  // Remove any remaining brackets or special characters that might be artifacts
  cleaned = cleaned.replace(/[\[\]<>]/g, '');
  
  return cleaned;
};

// Clean job description as well
export const cleanJobDescription = (description: string): string => {
  if (!description) return '';
  
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
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove triple+ line breaks
  cleaned = cleaned.replace(/[ \t]+/g, ' '); // Normalize spaces and tabs
  cleaned = cleaned.trim();
  
  return cleaned;
};

// Clean company names
export const cleanCompanyName = (company: string): string => {
  if (!company) return '';
  
  let cleaned = company.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  return cleaned;
};
