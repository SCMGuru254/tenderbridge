
import { Job } from '../types/job.ts';
import { JobSite } from '../types/jobSite.ts';

export default async function parseXmlJobs(xmlText: string, jobSite: JobSite): Promise<Job[]> {
  const jobs: Job[] = [];
  
  try {
    console.log(`Parsing XML for ${jobSite.source}, content length: ${xmlText.length}`);
    
    // Clean up the XML text
    const cleanXml = xmlText
      .replace(/&(?![a-zA-Z0-9#]{1,6};)/g, '&amp;') // Escape unescaped ampersands
      .replace(/<!\[CDATA\[(.*?)\]\]>/gs, (match, content) => {
        // Clean CDATA content
        return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      });
    
    // Parse XML using DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cleanXml, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error(`XML parsing error for ${jobSite.source}:`, parseError.textContent);
      return [];
    }
    
    // Find job items - try different RSS/XML structures
    let items = xmlDoc.querySelectorAll('item');
    if (items.length === 0) {
      items = xmlDoc.querySelectorAll('job');
    }
    if (items.length === 0) {
      items = xmlDoc.querySelectorAll('entry');
    }
    
    console.log(`Found ${items.length} items in XML for ${jobSite.source}`);
    
    items.forEach((item, index) => {
      try {
        // Extract title
        let title = getXmlText(item, 'title') || getXmlText(item, 'job_title') || '';
        title = cleanHtmlTags(title).trim();
        
        // Extract company - try multiple approaches
        let company = getXmlText(item, 'company') || 
                     getXmlText(item, 'job_company') || 
                     getXmlText(item, 'author') || '';
        
        // If no company field, try to extract from description
        if (!company) {
          const description = getXmlText(item, 'description') || getXmlText(item, 'content') || '';
          const companyMatch = description.match(/company[:\s]+([^<\n,]+)/i);
          if (companyMatch) {
            company = companyMatch[1].trim();
          }
        }
        
        company = cleanHtmlTags(company).trim() || 'Company not specified';
        
        // Extract location
        let location = getXmlText(item, 'location') || 
                      getXmlText(item, 'job_location') || 
                      getXmlText(item, 'region') || '';
        
        if (!location) {
          const description = getXmlText(item, 'description') || '';
          const locationMatch = description.match(/location[:\s]+([^<\n,]+)/i) ||
                               description.match(/(nairobi|mombasa|kisumu|nakuru|eldoret|kenya)/i);
          if (locationMatch) {
            location = locationMatch[1].trim();
          }
        }
        
        location = cleanHtmlTags(location).trim() || 'Kenya';
        
        // Extract job URL
        let jobUrl = getXmlText(item, 'link') || 
                    getXmlText(item, 'url') || 
                    getXmlText(item, 'guid') || '';
        
        // Validate and clean URL
        if (jobUrl && !jobUrl.startsWith('http')) {
          try {
            const baseUrl = new URL(jobSite.url).origin;
            jobUrl = new URL(jobUrl, baseUrl).href;
          } catch (e) {
            jobUrl = '';
          }
        }
        
        // Only include jobs with valid title and basic info
        if (title && title.length > 3 && title.toLowerCase() !== 'null') {
          // Filter by keywords if specified
          if (jobSite.keywords && jobSite.keywords.length > 0) {
            const titleLower = title.toLowerCase();
            const companyLower = company.toLowerCase();
            const locationLower = location.toLowerCase();
            
            const hasKeyword = jobSite.keywords.some(keyword => 
              titleLower.includes(keyword.toLowerCase()) ||
              companyLower.includes(keyword.toLowerCase()) ||
              locationLower.includes(keyword.toLowerCase())
            );
            
            if (!hasKeyword) {
              return; // Skip this job if it doesn't match keywords
            }
          }
          
          const job: Job = {
            title: title,
            company: company,
            location: location,
            source: jobSite.source,
            job_url: jobUrl || undefined,
            application_url: jobUrl || undefined,
            description: '', // Could be enhanced later
            job_type: 'full_time', // Default
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Try to extract job type
          const jobType = getXmlText(item, 'job_type') || getXmlText(item, 'employment_type');
          if (jobType) {
            job.job_type = cleanHtmlTags(jobType).trim();
          }
          
          // Try to extract deadline
          const deadline = getXmlText(item, 'deadline') || 
                          getXmlText(item, 'expiry_date') || 
                          getXmlText(item, 'application_deadline');
          if (deadline) {
            try {
              job.application_deadline = new Date(deadline).toISOString();
            } catch (e) {
              // Invalid date format, skip
            }
          }
          
          jobs.push(job);
          console.log(`Parsed XML job: "${title}" at "${company}" from ${jobSite.source}`);
        }
      } catch (error) {
        console.error(`Error parsing XML job item ${index} from ${jobSite.source}:`, error);
      }
    });
    
    console.log(`Successfully parsed ${jobs.length} jobs from XML for ${jobSite.source}`);
    return jobs;
  } catch (error) {
    console.error(`Error parsing XML for ${jobSite.source}:`, error);
    return [];
  }
}

function getXmlText(element: Element, tagName: string): string {
  const child = element.querySelector(tagName);
  return child ? child.textContent || '' : '';
}

function cleanHtmlTags(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();
}
