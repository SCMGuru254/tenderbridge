/**
 * Utility function to clean job titles from any remaining CDATA tags or HTML entities
 * This provides an additional cleaning step in the frontend before displaying job titles
 */

export function cleanJobTitle(title: string): string {
  if (!title) return '';
  
  let cleaned = title;
  
  // Handle all variations of complete CDATA tags with content
  // Standard XML CDATA format
  cleaned = cleaned.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');
  
  // HTML entity encoded variations (common in double-processed XML)
  cleaned = cleaned.replace(/&lt;!\[CDATA\[(.*?)\]\]&gt;/gs, '$1');
  cleaned = cleaned.replace(/&#60;!\[CDATA\[(.*?)\]\]&#62;/gs, '$1');
  cleaned = cleaned.replace(/&#x3C;!\[CDATA\[(.*?)\]\]&#x3E;/gs, '$1');
  
  // Additional numeric entity variations
  cleaned = cleaned.replace(/&#0*60;!\[CDATA\[(.*?)\]\]&#0*62;/gs, '$1');
  cleaned = cleaned.replace(/&#0*76;!\[CDATA\[(.*?)\]\]&#0*76;/gs, '$1');
  
  // Handle partial or malformed CDATA tags (opening tags)
  cleaned = cleaned
    .replace(/<!\[CDATA\[/g, '')
    .replace(/&lt;!\[CDATA\[/g, '')
    .replace(/&#60;!\[CDATA\[/g, '')
    .replace(/&#x3C;!\[CDATA\[/g, '')
    .replace(/&#0*60;!\[CDATA\[/g, '')
    .replace(/&amp;lt;!\[CDATA\[/g, '');
  
  // Handle partial or malformed CDATA tags (closing tags)
  cleaned = cleaned
    .replace(/\]\]>/g, '')
    .replace(/\]\]&gt;/g, '')
    .replace(/\]\]&#62;/g, '')
    .replace(/\]\]&#x3E;/g, '')
    .replace(/\]\]&#0*62;/g, '')
    .replace(/\]\]&amp;gt;/g, '');
  
  // Remove any HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x22;/g, '"')
    .replace(/&nbsp;/g, ' ');
  
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}