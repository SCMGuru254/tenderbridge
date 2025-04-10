
// Simple XML parsing utility for JobWebKenya feed
export function parseXmlFeed(xmlText: string): any[] {
  const items = [];
  
  // First try to extract <item> elements (RSS feeds)
  let itemRegex = /<item>([\s\S]*?)<\/item>/g;
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
  
  // If no items found, try to extract <job> elements (custom job feeds)
  if (items.length === 0) {
    itemRegex = /<job>([\s\S]*?)<\/job>/g;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const jobContent = match[1];
      const job: Record<string, string> = {};
      
      // Extract standard fields
      const fieldRegex = /<([^>]+)>([\s\S]*?)<\/\1>/g;
      let fieldMatch;
      
      while ((fieldMatch = fieldRegex.exec(jobContent)) !== null) {
        const fieldName = fieldMatch[1].toLowerCase();
        const fieldValue = fieldMatch[2]
          .replace(/<!\[CDATA\[/g, '')
          .replace(/\]\]>/g, '')
          .replace(/<[^>]*>/g, ' ')
          .trim();
          
        job[fieldName] = fieldValue;
      }
      
      // Check if job has minimum required fields
      if (job.title && (job.description || job.link)) {
        // Map fields to standard format
        if (job.link) job.link = job.link;
        if (job.url) job.link = job.url;
        if (job.description) job.description = job.description;
        if (job.company) job.company = job.company;
        if (job.location) job.location = job.location;
        if (job.job_type) job.jobType = job.job_type;
        if (job.deadline) job.deadline = job.deadline;
        
        items.push(job);
      }
    }
  }
  
  // If still no items found, try one more approach with generic tag extraction
  if (items.length === 0) {
    // Try to extract based on XML structure patterns
    const tagRegex = /<([a-zA-Z0-9_]+)>([\s\S]*?)<\/\1>/g;
    const jobData: Record<string, string[]> = {};
    
    while ((match = tagRegex.exec(xmlText)) !== null) {
      const tagName = match[1].toLowerCase();
      const tagContent = match[2].trim()
        .replace(/<!\[CDATA\[/g, '')
        .replace(/\]\]>/g, '')
        .replace(/<[^>]*>/g, ' ');
      
      if (!jobData[tagName]) {
        jobData[tagName] = [];
      }
      
      jobData[tagName].push(tagContent);
    }
    
    // Build job objects based on extracted data
    if (jobData.title && jobData.title.length > 0) {
      for (let i = 0; i < jobData.title.length; i++) {
        const job: Record<string, string> = {
          title: jobData.title[i]
        };
        
        // Map other fields if available
        if (jobData.description && jobData.description[i]) job.description = jobData.description[i];
        if (jobData.link && jobData.link[i]) job.link = jobData.link[i];
        if (jobData.company && jobData.company[i]) job.company = jobData.company[i];
        if (jobData.location && jobData.location[i]) job.location = jobData.location[i];
        if (jobData.job_type && jobData.job_type[i]) job.jobType = jobData.job_type[i];
        
        items.push(job);
      }
    }
  }
  
  return items;
}
