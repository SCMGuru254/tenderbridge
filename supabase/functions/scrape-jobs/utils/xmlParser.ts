
// Simple XML parsing utility for JobWebKenya feed
export function parseXmlFeed(xmlText: string): any[] {
  const items = [];
  
  // Extract all <item> elements
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    const item: Record<string, string> = {};
    
    // Extract title
    const titleMatch = /<title>(.*?)<\/title>/i.exec(itemContent);
    if (titleMatch) {
      item.title = titleMatch[1].trim();
    }
    
    // Extract link
    const linkMatch = /<link>(.*?)<\/link>/i.exec(itemContent);
    if (linkMatch) {
      item.link = linkMatch[1].trim();
    }
    
    // Extract description
    const descMatch = /<description>([\s\S]*?)<\/description>/i.exec(itemContent);
    if (descMatch) {
      item.description = descMatch[1].trim()
        .replace(/<!\[CDATA\[/g, '')
        .replace(/\]\]>/g, '')
        .replace(/<[^>]*>/g, ' '); // Basic HTML tag removal
    }
    
    // Extract pubDate
    const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/i.exec(itemContent);
    if (pubDateMatch) {
      item.pubDate = pubDateMatch[1].trim();
    }
    
    // Extract company if available
    const companyMatch = /<job_listing_company>(.*?)<\/job_listing_company>/i.exec(itemContent);
    if (companyMatch) {
      item.company = companyMatch[1].trim();
    } else {
      // Try to extract from custom namespaces that might exist
      const jobMetaMatch = /<job:meta>([\s\S]*?)<\/job:meta>/i.exec(itemContent);
      if (jobMetaMatch) {
        const companyInMeta = /<company>(.*?)<\/company>/i.exec(jobMetaMatch[1]);
        if (companyInMeta) {
          item.company = companyInMeta[1].trim();
        }
      }
    }
    
    // Extract location if available
    const locationMatch = /<job_listing_location>(.*?)<\/job_listing_location>/i.exec(itemContent);
    if (locationMatch) {
      item.location = locationMatch[1].trim();
    }
    
    // Extract job type if available
    const jobTypeMatch = /<job_listing_job_type>(.*?)<\/job_listing_job_type>/i.exec(itemContent);
    if (jobTypeMatch) {
      item.jobType = jobTypeMatch[1].trim();
    }
    
    // Extract expiry date if available
    const expiryMatch = /<job_listing_expiry_date>(.*?)<\/job_listing_expiry_date>/i.exec(itemContent);
    if (expiryMatch) {
      item.expiryDate = expiryMatch[1].trim();
    }
    
    // Check if the item has enough data to be useful
    if (item.title && (item.link || item.description)) {
      items.push(item);
    }
  }
  
  return items;
}
