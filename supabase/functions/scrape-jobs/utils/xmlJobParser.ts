import { Job } from "../types/job.ts";
import { hasSupplyChainKeywords } from "./jobFilters.ts";
import { parseXmlFeed } from "./xmlParser.ts";

export async function parseSupplyChainJobsXml(xmlUrl: string): Promise<Job[]> {
  try {
    console.log(`Fetching XML feed from ${xmlUrl}`);
    
    const response = await fetch(xmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*; q=0.01'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch XML feed: ${response.status} ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log(`Received XML feed, length: ${xmlText.length} chars`);
    
    // Try using the built-in XML parser first
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      if (!xmlDoc) {
        throw new Error("Failed to parse XML document");
      }
      
      const jobElements = xmlDoc.querySelectorAll("job") || [];
      console.log(`Found ${jobElements.length} job entries in XML feed`);
      
      if (jobElements.length === 0) {
        // If no <job> elements found, try with <item> which is more common in RSS feeds
        const itemElements = xmlDoc.querySelectorAll("item") || [];
        console.log(`Found ${itemElements.length} item entries in XML feed`);
        
        if (itemElements.length > 0) {
          return parseRssItems(itemElements);
        } else {
          // Fall back to our custom XML parser as a last resort
          console.log("No standard job/item elements found, trying custom XML parser");
          const items = parseXmlFeed(xmlText);
          return parseCustomItems(items);
        }
      }
      
      const scrapedJobs: Job[] = [];
      
      for (const jobElement of jobElements) {
        try {
          // Extract basic job details
          const title = jobElement.querySelector("title")?.textContent || "";
          const company = jobElement.querySelector("company")?.textContent || "Unknown Company";
          const location = jobElement.querySelector("location")?.textContent || "Kenya";
          const description = jobElement.querySelector("description")?.textContent || "";
          const jobUrl = jobElement.querySelector("link")?.textContent || null;
          const jobType = jobElement.querySelector("job_type")?.textContent || "full_time";
          const deadline = jobElement.querySelector("deadline")?.textContent || null;
          
          // Only include supply chain related jobs
          if (hasSupplyChainKeywords(title) || hasSupplyChainKeywords(description)) {
            scrapedJobs.push({
              title,
              company,
              location,
              description,
              job_type: jobType,
              source: "MyJobMag XML Feed",
              job_url: jobUrl,
              application_url: jobUrl,
              deadline: deadline,
              tags: extractSupplyChainKeywords(title + " " + description)
            });
          }
        } catch (error) {
          console.error("Error parsing job entry:", error);
        }
      }
      
      console.log(`Filtered ${scrapedJobs.length} supply chain related jobs from XML feed`);
      return scrapedJobs;
    } catch (xmlError) {
      console.error("Error with DOM parser, falling back to custom parser:", xmlError);
      // Fall back to our simple custom parser
      const items = parseXmlFeed(xmlText);
      return parseCustomItems(items);
    }
  } catch (error) {
    console.error("Error parsing MyJobMag XML feed:", error);
    return [];
  }
}

function parseRssItems(items: NodeListOf<Element>): Job[] {
  const scrapedJobs: Job[] = [];
  
  for (const item of items) {
    try {
      const title = item.querySelector("title")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const company = extractCompanyFromDescription(description) || "MyJobMag";
      const location = extractLocationFromDescription(description) || "Kenya";
      const jobUrl = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      
      // Only include supply chain related jobs
      if (hasSupplyChainKeywords(title) || hasSupplyChainKeywords(description)) {
        scrapedJobs.push({
          title,
          company,
          location,
          description: cleanDescription(description),
          job_type: determineJobType(description),
          source: "MyJobMag RSS Feed",
          job_url: jobUrl,
          application_url: jobUrl,
          deadline: calculateDeadline(pubDate),
          tags: extractSupplyChainKeywords(title + " " + description)
        });
      }
    } catch (error) {
      console.error("Error parsing RSS item:", error);
    }
  }
  
  console.log(`Filtered ${scrapedJobs.length} supply chain related jobs from RSS feed`);
  return scrapedJobs;
}

function parseCustomItems(items: any[]): Job[] {
  const scrapedJobs: Job[] = [];
  
  for (const item of items) {
    try {
      const title = item.title || "";
      const description = item.description || "";
      
      // Skip non-supply chain jobs
      if (!hasSupplyChainKeywords(title) && !hasSupplyChainKeywords(description)) {
        continue;
      }

      // Extract skills from description if not provided
      const skills = item.skills || extractSkillsFromDescription(description);
      
      // Determine if job is remote
      const isRemote = item.is_remote || 
        (description.toLowerCase().includes('remote') || 
         description.toLowerCase().includes('work from home'));
      
      // Extract experience level if not provided
      const experienceLevel = item.experience_level || 
        extractExperienceLevel(description);
      
      // Extract salary if not provided
      const salary = item.salary || 
        extractSalaryFromDescription(description);
      
      // Extract employment type if not provided
      const employmentType = item.employment_type || 
        determineEmploymentType(description);
      
      scrapedJobs.push({
        title,
        company: item.company || extractCompanyFromDescription(description) || "MyJobMag",
        location: item.location || extractLocationFromDescription(description) || "Kenya",
        description: cleanDescription(description),
        job_type: item.jobType || determineJobType(description) || "full_time",
        source: "MyJobMag Custom Feed",
        job_url: item.link || "",
        application_url: item.link || "",
        deadline: item.deadline || calculateDeadline(item.pubDate || ""),
        tags: extractSupplyChainKeywords(title + " " + description),
        salary: salary,
        experience_level: experienceLevel,
        skills: skills,
        employment_type: employmentType,
        is_remote: isRemote,
        company_website: item.company_website || extractCompanyWebsite(description),
        company_description: item.company_description || extractCompanyDescription(description),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error parsing custom item:", error);
    }
  }
  
  console.log(`Filtered ${scrapedJobs.length} supply chain related jobs from custom XML parser`);
  return scrapedJobs;
}

function extractCompanyFromDescription(description: string): string | null {
  // Try to find company in description
  const companyMatch = description.match(/Company\s*:\s*([^,\n]+)/i) || 
                       description.match(/at\s+([A-Z][A-Za-z\s&]+)/);
  return companyMatch ? companyMatch[1].trim() : null;
}

function extractLocationFromDescription(description: string): string | null {
  // Try to find location in description
  const locationMatch = description.match(/Location\s*:\s*([^,\n]+)/i) || 
                        description.match(/in\s+([A-Z][A-Za-z\s,]+),\s*Kenya/);
  return locationMatch ? locationMatch[1].trim() : null;
}

function cleanDescription(description: string): string {
  // Enhanced CDATA cleaning to handle all variations
  let cleaned = description;
  
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

  
  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');
  
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Clean up common XML/HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x22;/g, '"');
  
  return cleaned;
}

function determineJobType(description: string): string {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes("part-time") || lowerDesc.includes("part time")) {
    return "part_time";
  } else if (lowerDesc.includes("contract")) {
    return "contract";
  } else if (lowerDesc.includes("intern") || lowerDesc.includes("internship")) {
    return "internship";
  } else if (lowerDesc.includes("temporary")) {
    return "temporary";
  } else {
    return "full_time";
  }
}

function calculateDeadline(pubDate: string): string | null {
  if (!pubDate) return null;
  
  try {
    const date = new Date(pubDate);
    if (isNaN(date.getTime())) return null;
    
    // Add 30 days as default application window
    date.setDate(date.getDate() + 30);
    return date.toISOString();
  } catch (e) {
    return null;
  }
}

function extractSupplyChainKeywords(text: string): string[] {
  const keywords = [
    'supply chain', 'logistics', 'procurement', 'warehouse', 'inventory',
    'shipping', 'distribution', 'operations', 'sourcing', 'purchasing',
    'transport', 'fleet', 'materials', 'import', 'export'
  ];
  
  const result: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const keyword of keywords) {
    if (lowerText.includes(keyword)) {
      result.push(keyword);
    }
  }
  
  return result;
}

// Helper functions for extracting additional information
function extractSkillsFromDescription(description: string): string[] {
  const skills: string[] = [];
  const skillPatterns = [
    /required skills:?\s*([^.]*)/i,
    /skills required:?\s*([^.]*)/i,
    /qualifications:?\s*([^.]*)/i,
    /requirements:?\s*([^.]*)/i
  ];
  
  for (const pattern of skillPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      const skillList = match[1].split(/[,;]/).map(s => s.trim());
      skills.push(...skillList);
    }
  }
  
  return [...new Set(skills)]; // Remove duplicates
}

function extractExperienceLevel(description: string): string | null {
  const experiencePatterns = [
    /(\d+)\+?\s*years?\s+experience/i,
    /experience:?\s*(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*years?\s+in\s+the\s+field/i
  ];
  
  for (const pattern of experiencePatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return `${match[1]} years`;
    }
  }
  
  return null;
}

function extractSalaryFromDescription(description: string): string | null {
  const salaryPatterns = [
    /salary:?\s*([^.]*)/i,
    /compensation:?\s*([^.]*)/i,
    /pay:?\s*([^.]*)/i,
    /KSH\s*(\d+(?:,\d+)*(?:\.\d+)?)/i,
    /KES\s*(\d+(?:,\d+)*(?:\.\d+)?)/i
  ];
  
  for (const pattern of salaryPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

function determineEmploymentType(description: string): string | null {
  const types = {
    full_time: /full\s*-?\s*time/i,
    part_time: /part\s*-?\s*time/i,
    contract: /contract|temporary|fixed\s*term/i,
    internship: /intern|internship|trainee/i,
    freelance: /freelance|consultant|self\s*-?\s*employed/i
  };
  
  for (const [type, pattern] of Object.entries(types)) {
    if (pattern.test(description)) {
      return type;
    }
  }
  
  return null;
}

function extractCompanyWebsite(description: string): string | null {
  const websitePattern = /(?:visit|website|web):?\s*(https?:\/\/[^\s]+)/i;
  const match = description.match(websitePattern);
  return match ? match[1] : null;
}

function extractCompanyDescription(description: string): string | null {
  const companyPatterns = [
    /about\s+the\s+company:?\s*([^.]*)/i,
    /company\s+description:?\s*([^.]*)/i,
    /about\s+us:?\s*([^.]*)/i
  ];
  
  for (const pattern of companyPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}
