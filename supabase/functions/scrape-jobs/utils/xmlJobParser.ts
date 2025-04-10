
import { Job } from "../types/job.ts";
import { hasSupplyChainKeywords } from "./jobFilters.ts";

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
    
    // Basic XML parsing - Extract job entries
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    if (!xmlDoc) {
      throw new Error("Failed to parse XML document");
    }
    
    const jobElements = xmlDoc.querySelectorAll("job") || [];
    console.log(`Found ${jobElements.length} job entries in XML feed`);
    
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
  } catch (error) {
    console.error("Error parsing MyJobMag XML feed:", error);
    return [];
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
