
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log(`HTML response length: ${html.length} characters`);
    
    const $ = load(html);
    const jobElements = $(jobSite.selectors.jobContainer);
    
    console.log(`Found ${jobElements.length} job containers`);
    
    jobElements.each((index, element) => {
      try {
        const $element = $(element);
        
        // Extract job information
        const title = $element.find(jobSite.selectors.title).first().text().trim();
        const company = $element.find(jobSite.selectors.company).first().text().trim();
        const location = $element.find(jobSite.selectors.location).first().text().trim();
        
        // Extract job URL
        let jobUrl = '';
        if (jobSite.selectors.jobLink) {
          const linkElement = $element.find(jobSite.selectors.jobLink).first();
          jobUrl = linkElement.attr('href') || '';
          
          // Make relative URLs absolute
          if (jobUrl && !jobUrl.startsWith('http')) {
            const baseUrl = new URL(jobSite.url).origin;
            jobUrl = new URL(jobUrl, baseUrl).href;
          }
        }
        
        // Only include jobs with valid title and company
        if (title && company && title.length > 3) {
          // Filter by keywords if specified
          if (jobSite.keywords && jobSite.keywords.length > 0) {
            const titleLower = title.toLowerCase();
            const hasKeyword = jobSite.keywords.some(keyword => 
              titleLower.includes(keyword.toLowerCase())
            );
            
            if (!hasKeyword) {
              return; // Skip this job if it doesn't match keywords
            }
          }
          
          const job: Job = {
            title,
            company,
            location: location || 'Kenya',
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
            const jobType = $element.find(jobSite.selectors.jobType).first().text().trim();
            if (jobType) job.job_type = jobType;
          }
          
          if (jobSite.selectors.deadline) {
            const deadline = $element.find(jobSite.selectors.deadline).first().text().trim();
            if (deadline) {
              try {
                job.application_deadline = new Date(deadline).toISOString();
              } catch (e) {
                // Invalid date format, skip
              }
            }
          }
          
          jobs.push(job);
          console.log(`Extracted job: ${title} at ${company}`);
        }
      } catch (error) {
        console.error(`Error processing job element ${index}:`, error);
      }
    });
    
    console.log(`Successfully scraped ${jobs.length} jobs from ${jobSite.source}`);
    return jobs;
  } catch (error) {
    console.error(`Error scraping HTML site ${jobSite.source}:`, error);
    return [];
  }
}
