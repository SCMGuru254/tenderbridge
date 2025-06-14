
import { load } from 'https://esm.sh/cheerio@1.0.0';
import { JobSite } from '../types/jobSite.ts';
import { Job } from '../types/job.ts';
import parseXmlJobs from '../utils/xmlJobParser.ts';

export async function scrapeJobSites(jobSite: JobSite): Promise<Job[]> {
  console.log(`Starting scrape for: ${jobSite.source}`);
  
  try {
    // Handle XML feeds differently
    if (jobSite.isXmlFeed) {
      console.log(`Processing XML feed for ${jobSite.source}`);
      return await scrapeXmlFeed(jobSite);
    }
    
    // Handle regular HTML scraping
    console.log(`Processing HTML scraping for ${jobSite.source}`);
    return await scrapeHtmlSite(jobSite);
  } catch (error) {
    console.error(`Error scraping ${jobSite.source}:`, error);
    return [];
  }
}

async function scrapeXmlFeed(jobSite: JobSite): Promise<Job[]> {
  try {
    console.log(`Fetching XML from: ${jobSite.url}`);
    
    const response = await fetch(jobSite.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log(`XML response length: ${xmlText.length} characters`);
    
    // Parse XML jobs using the utility function
    const jobs = await parseXmlJobs(xmlText, jobSite);
    console.log(`Parsed ${jobs.length} jobs from XML`);
    
    return jobs;
  } catch (error) {
    console.error(`Error scraping XML feed ${jobSite.source}:`, error);
    return [];
  }
}

async function scrapeHtmlSite(jobSite: JobSite): Promise<Job[]> {
  const jobs: Job[] = [];
  
  try {
    console.log(`Fetching HTML from: ${jobSite.url}`);
    
    const response = await fetch(jobSite.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    });
    
    if (!response.ok) {
      console.error(`HTTP error for ${jobSite.source}: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const html = await response.text();
    console.log(`HTML response length for ${jobSite.source}: ${html.length} characters`);
    
    if (html.length < 100) {
      console.error(`Response too short for ${jobSite.source}, likely blocked or empty`);
      return [];
    }
    
    const $ = load(html);
    const pageTitle = $('title').text();
    console.log(`Page title for ${jobSite.source}: ${pageTitle}`);

    // Try multiple job container selectors
    const containerSelectors = jobSite.selectors.jobContainer.split(',').map(s => s.trim());
    let jobElements = $();
    
    for (const selector of containerSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        jobElements = elements;
        console.log(`Found ${elements.length} job containers with selector: ${selector}`);
        break;
      }
    }
    
    if (jobElements.length === 0) {
      console.log(`No job containers found for ${jobSite.source} with any selector`);
      // Try to find any elements that might contain job listings
      const fallbackSelectors = [
        '.job', '.job-item', '.job-card', '.job-listing', 
        '[class*="job"]', '[class*="vacancy"]', '.position',
        'article', '.card', '.item', '.result'
      ];
      
      for (const fallback of fallbackSelectors) {
        const elements = $(fallback);
        if (elements.length > 0) {
          jobElements = elements;
          console.log(`Found ${elements.length} potential job containers with fallback selector: ${fallback}`);
          break;
        }
      }
    }

    if (jobElements.length === 0) {
      console.log(`No job elements found for ${jobSite.source}`);
      return [];
    }
    
    console.log(`Processing ${jobElements.length} job elements for ${jobSite.source}`);
    
    jobElements.each((index, element) => {
      try {
        const $element = $(element);
        
        // Extract job information with multiple selector attempts
        const title = extractText($element, jobSite.selectors.title, $);
        const company = extractText($element, jobSite.selectors.company, $);
        const location = extractText($element, jobSite.selectors.location, $);
        
        // Extract job URL
        let jobUrl = '';
        if (jobSite.selectors.jobLink) {
          const linkElement = $element.find(jobSite.selectors.jobLink).first();
          jobUrl = linkElement.attr('href') || '';
          
          // Make relative URLs absolute
          if (jobUrl && !jobUrl.startsWith('http')) {
            try {
              const baseUrl = new URL(jobSite.url).origin;
              jobUrl = new URL(jobUrl, baseUrl).href;
            } catch (e) {
              console.log(`Could not resolve URL for ${title}: ${jobUrl}`);
              jobUrl = '';
            }
          }
        }
        
        // Only include jobs with valid title
        if (title && title.length > 2 && title.toLowerCase() !== 'null') {
          // Filter by keywords if specified
          if (jobSite.keywords && jobSite.keywords.length > 0) {
            const titleLower = title.toLowerCase();
            const companyLower = (company || '').toLowerCase();
            const locationLower = (location || '').toLowerCase();
            
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
            title: title.trim(),
            company: company ? company.trim() : 'Company not specified',
            location: location ? location.trim() : 'Kenya',
            source: jobSite.source,
            job_url: jobUrl || undefined,
            application_url: jobUrl || undefined,
            description: '', // Will be filled if available
            job_type: 'full_time', // Default
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Extract additional fields if selectors are provided
          if (jobSite.selectors.jobType) {
            const jobType = extractText($element, jobSite.selectors.jobType, $);
            if (jobType) job.job_type = jobType;
          }
          
          if (jobSite.selectors.deadline) {
            const deadline = extractText($element, jobSite.selectors.deadline, $);
            if (deadline) {
              try {
                job.application_deadline = new Date(deadline).toISOString();
              } catch (e) {
                // Invalid date format, skip
              }
            }
          }
          
          jobs.push(job);
          console.log(`Extracted job: "${title}" at "${company}" from ${jobSite.source}`);
        } else {
          console.log(`Skipping job with invalid title: "${title}" from ${jobSite.source}`);
        }
      } catch (error) {
        console.error(`Error processing job element ${index} from ${jobSite.source}:`, error);
      }
    });
    
    console.log(`Successfully scraped ${jobs.length} jobs from ${jobSite.source}`);
    return jobs;
  } catch (error) {
    console.error(`Error scraping HTML site ${jobSite.source}:`, error);
    return [];
  }
}

function extractText($element: any, selectors: string, $: any): string {
  if (!selectors) return '';
  
  const selectorList = selectors.split(',').map(s => s.trim());
  
  for (const selector of selectorList) {
    try {
      const text = $element.find(selector).first().text().trim();
      if (text && text.length > 0) {
        return text;
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  // Fallback: try to get any text content if selectors don't work
  const elementText = $element.text().trim();
  return elementText || '';
}
