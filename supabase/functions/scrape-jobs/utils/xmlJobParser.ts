
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';
import { JobSite } from '../types/jobSite.ts';
import { Job } from '../types/job.ts';

export default async function parseXmlJobs(xmlContent: string, jobSite: JobSite): Promise<Job[]> {
  console.log(`Parsing XML for ${jobSite.source}, content length: ${xmlContent.length}`);
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');
    
    if (!doc) {
      console.error(`Failed to parse XML for ${jobSite.source}`);
      return [];
    }
    
    const items = doc.querySelectorAll('item');
    console.log(`Found ${items.length} job items in XML`);
    
    const jobs: Job[] = [];
    
    items.forEach((item, index) => {
      try {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        const link = item.querySelector('link')?.textContent?.trim() || '';
        const description = item.querySelector('description')?.textContent?.trim() || '';
        const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
        
        // Extract company from description or use a default
        let company = 'Company not specified';
        const descriptionLower = description.toLowerCase();
        
        // Try to extract company from common patterns in job descriptions
        if (description.includes('Company:')) {
          const companyMatch = description.match(/Company:\s*([^\n\r]+)/i);
          if (companyMatch) {
            company = companyMatch[1].trim();
          }
        }
        
        // Skip if no meaningful title
        if (!title || title.length < 3 || title.toLowerCase() === 'null') {
          console.log(`Skipping job with invalid title: "${title}"`);
          return;
        }
        
        // Filter by keywords if specified
        if (jobSite.keywords && jobSite.keywords.length > 0) {
          const titleLower = title.toLowerCase();
          const hasKeyword = jobSite.keywords.some(keyword => 
            titleLower.includes(keyword.toLowerCase()) ||
            descriptionLower.includes(keyword.toLowerCase())
          );
          
          if (!hasKeyword) {
            return;
          }
        }
        
        const job: Job = {
          title: title.slice(0, 255), // Ensure title fits in database
          company: company.slice(0, 255),
          location: 'Kenya', // Default location for Kenyan job sites
          source: jobSite.source,
          job_url: link || undefined,
          application_url: link || undefined,
          description: description.slice(0, 5000), // Limit description length
          job_type: 'full_time',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Parse publication date if available
        if (pubDate) {
          try {
            const parsedDate = new Date(pubDate);
            if (!isNaN(parsedDate.getTime())) {
              job.created_at = parsedDate.toISOString();
            }
          } catch (e) {
            // Use current date if parsing fails
          }
        }
        
        jobs.push(job);
        console.log(`✅ Parsed XML job: "${job.title}" at "${job.company}"`);
      } catch (error) {
        console.error(`Error parsing job item ${index}:`, error);
      }
    });
    
    console.log(`Successfully parsed ${jobs.length} jobs from XML`);
    return jobs;
  } catch (error) {
    console.error(`Error parsing XML for ${jobSite.source}:`, error);
    return [];
  }
}
