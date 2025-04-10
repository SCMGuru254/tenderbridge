
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
        tags: extractSupplyChainKeywords(title + " " + description)
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
  return description
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
