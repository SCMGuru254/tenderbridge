
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";
import { JobSite } from "../types/jobSite.ts";
import { Job } from "../types/job.ts";
import { hasSupplyChainKeywords } from "../utils/jobFilters.ts";

export async function scrapeJobSites(site: JobSite): Promise<Job[]> {
  const scrapedJobs: Job[] = [];
  try {
    console.log(`Scraping ${site.source} at ${site.url}...`);
    
    // Fetch the page content with a proper user agent to avoid being blocked
    const response = await fetch(site.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
      }
    });
    
    if (!response.ok) {
      console.error(`Error fetching ${site.url}: ${response.status} ${response.statusText}`);
      return scrapedJobs;
    }
    
    const html = await response.text();
    console.log(`Received HTML from ${site.source}, length: ${html.length} chars`);
    
    // Parse the HTML
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    
    if (!document) {
      console.error(`Failed to parse HTML from ${site.url}`);
      return scrapedJobs;
    }
    
    // Extract job listings
    const jobListings = document.querySelectorAll(site.selectors.jobContainer);
    console.log(`Found ${jobListings.length} potential job listings on ${site.source}`);
    
    // Process job listings with targeted selectors
    let jobsFoundWithSelectors = false;
    
    if (jobListings.length > 0) {
      for (const listing of jobListings) {
        try {
          const job = extractJobFromListing(listing, site);
          
          if (job && hasSupplyChainKeywords(job.title)) {
            scrapedJobs.push(job);
            jobsFoundWithSelectors = true;
          }
        } catch (listingError) {
          console.error(`Error processing listing from ${site.source}:`, listingError);
        }
      }
    }
    
    // If no jobs were found with specific selectors, try general approach
    if (!jobsFoundWithSelectors) {
      console.log(`No valid jobs found with primary selectors on ${site.source}, trying general approach...`);
      
      // Look for job titles
      const titleElements = document.querySelectorAll('h1, h2, h3, h4, h5, .job-title, [class*="title"], [class*="job"]');
      
      for (const element of titleElements) {
        try {
          const title = element.textContent?.trim();
          
          if (title && hasSupplyChainKeywords(title)) {
            const job = extractJobFromGeneralApproach(element, site);
            if (job) {
              scrapedJobs.push(job);
            }
          }
        } catch (elementError) {
          console.error(`Error processing element from ${site.source}:`, elementError);
        }
      }
    }
    
    console.log(`Successfully scraped ${scrapedJobs.length} jobs from ${site.source}`);
    return scrapedJobs;
  } catch (error) {
    console.error(`Error scraping ${site.url}:`, error);
    return scrapedJobs;
  }
}

function extractJobFromListing(listing: Element, site: JobSite): Job | null {
  const titleElement = listing.querySelector(site.selectors.title);
  const companyElement = listing.querySelector(site.selectors.company);
  const locationElement = listing.querySelector(site.selectors.location);
  const typeElement = site.selectors.type ? listing.querySelector(site.selectors.type) : null;
  const urlElement = listing.querySelector(site.selectors.url);
  
  if (!titleElement) {
    return null;
  }
  
  const title = titleElement.textContent?.trim() || 'Supply Chain Position';
  const company = companyElement?.textContent?.trim() || site.source;
  const location = locationElement?.textContent?.trim() || 'Kenya';
  const jobType = typeElement?.textContent?.trim()?.toLowerCase() || 'full_time';
  
  // Extract job URL
  let jobUrl = null;
  if (urlElement && urlElement.getAttribute('href')) {
    let href = urlElement.getAttribute('href');
    // Add domain if the URL is relative
    if (href.startsWith('/')) {
      const siteUrl = new URL(site.url);
      href = `${siteUrl.origin}${href}`;
    }
    jobUrl = href;
  }
  
  // Map job type to standard values
  const standardJobType = mapToStandardJobType(jobType);
  
  return {
    title,
    company,
    location,
    source: site.source,
    job_type: standardJobType,
    description: `${title} at ${company} in ${location}. This is a ${standardJobType} position.`,
    job_url: jobUrl
  };
}

function extractJobFromGeneralApproach(element: Element, site: JobSite): Job | null {
  const title = element.textContent?.trim();
  if (!title) return null;
  
  // Get the parent element to look for more job details
  const jobContainer = element.parentElement;
  if (!jobContainer) return null;
  
  const companyText = jobContainer.querySelector('[class*="company"], [class*="employer"], [class*="subtitle"]')?.textContent?.trim();
  const locationText = jobContainer.querySelector('[class*="location"], address')?.textContent?.trim();
  
  // Look for a link
  const linkElement = element.closest('a') || jobContainer.querySelector('a[href]');
  let jobUrl = null;
  
  if (linkElement && linkElement.getAttribute('href')) {
    let href = linkElement.getAttribute('href');
    // Add domain if the URL is relative
    if (href.startsWith('/')) {
      const siteUrl = new URL(site.url);
      href = `${siteUrl.origin}${href}`;
    }
    jobUrl = href;
  }
  
  return {
    title,
    company: companyText || site.source,
    location: locationText || 'Kenya',
    source: site.source,
    job_type: 'full_time', // Default
    description: `${title} position in supply chain or logistics.`,
    job_url: jobUrl
  };
}

function mapToStandardJobType(jobType: string): string {
  if (jobType.includes('part')) return 'part_time';
  if (jobType.includes('contract')) return 'contract';
  if (jobType.includes('intern')) return 'internship';
  return 'full_time';
}
