import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";
import { JobSite } from "../types/jobSite.ts";
import { Job } from "../types/job.ts";
import { hasSupplyChainKeywords } from "../utils/jobFilters.ts";
import { parseXmlFeed } from "../utils/xmlParser.ts";

export async function scrapeJobSites(site: JobSite): Promise<Job[]> {
  const scrapedJobs: Job[] = [];
  
  try {
    console.log(`Scraping ${site.source} at ${site.url}...`);
    
    // Check if this is an XML feed
    if (site.isXmlFeed) {
      return await scrapeXmlFeed(site);
    }
    
    // Enhanced direct Google Jobs handling - if the site is Google Jobs
    if (site.source === 'Google') {
      return await scrapeDirectFromGoogle(site);
    }
    
    // Special handling for MyJobMag Widget
    if (site.source === 'MyJobMag Widget') {
      return await scrapeMyJobMagWidget(site);
    }
    
    // Special handling for API endpoints (e.g., Google Jobs via SerpAPI)
    if (site.source === 'Google' && site.url.includes('serpapi.com')) {
      return await scrapeFromGoogleJobsApi(site);
    }
    
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

async function scrapeMyJobMagWidget(site: JobSite): Promise<Job[]> {
  const scrapedJobs: Job[] = [];
  
  try {
    console.log("Scraping from MyJobMag Widget...");
    
    const response = await fetch(site.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    if (!response.ok) {
      console.error(`Error fetching MyJobMag Widget: ${response.status} ${response.statusText}`);
      return scrapedJobs;
    }
    
    const html = await response.text();
    console.log(`Received HTML from MyJobMag Widget, length: ${html.length} chars`);
    
    // Parse the HTML
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    
    if (!document) {
      console.error(`Failed to parse HTML from MyJobMag Widget`);
      return scrapedJobs;
    }
    
    // Widget-specific selectors
    const jobElements = document.querySelectorAll(".list-group-item");
    console.log(`Found ${jobElements.length} job listings in MyJobMag Widget`);
    
    for (const jobElement of jobElements) {
      try {
        const titleElement = jobElement.querySelector("a.job-title");
        const companyElement = jobElement.querySelector(".company-name");
        const locationElement = jobElement.querySelector(".job-location");
        
        if (!titleElement) continue;
        
        const title = titleElement.textContent?.trim() || "";
        const company = companyElement?.textContent?.trim() || "Unknown Company";
        const location = locationElement?.textContent?.trim() || "Kenya";
        
        // Get job URL
        let jobUrl = null;
        if (titleElement.hasAttribute("href")) {
          jobUrl = titleElement.getAttribute("href");
          // Add domain if URL is relative
          if (jobUrl && jobUrl.startsWith("/")) {
            jobUrl = `https://www.myjobmag.co.ke${jobUrl}`;
          }
        }
        
        // Extract deadline if present
        const deadlineElement = jobElement.querySelector(".deadline-date");
        const deadline = deadlineElement?.textContent?.trim() || null;
        
        // Extract job type if present
        const jobTypeElement = jobElement.querySelector(".job-type");
        const jobType = jobTypeElement?.textContent?.trim() || "full_time";
        
        if (hasSupplyChainKeywords(title)) {
          scrapedJobs.push({
            title,
            company,
            location,
            job_type: mapToStandardJobType(jobType),
            source: "MyJobMag Widget",
            description: `${title} position at ${company} in ${location}`,
            job_url: jobUrl,
            application_url: jobUrl,
            deadline: deadline
          });
        }
      } catch (error) {
        console.error("Error processing MyJobMag widget job:", error);
      }
    }
    
    console.log(`Successfully scraped ${scrapedJobs.length} jobs from MyJobMag Widget`);
    return scrapedJobs;
  } catch (error) {
    console.error("Error scraping from MyJobMag Widget:", error);
    return scrapedJobs;
  }
}

async function scrapeDirectFromGoogle(site: JobSite): Promise<Job[]> {
  const scrapedJobs: Job[] = [];
  const keywords = ["supply chain kenya", "logistics kenya", "procurement kenya", "warehouse kenya"];
  
  try {
    console.log("Scraping directly from Google Jobs...");
    
    for (const keyword of keywords) {
      const encodedKeyword = encodeURIComponent(keyword);
      const googleJobsUrl = `https://www.google.com/search?q=${encodedKeyword}&ibp=htl;jobs`;
      
      console.log(`Fetching Google Jobs for keyword: ${keyword}`);
      
      const response = await fetch(googleJobsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.google.com/'
        }
      });
      
      if (!response.ok) {
        console.error(`Error fetching Google Jobs: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const html = await response.text();
      console.log(`Received HTML from Google Jobs, length: ${html.length} chars`);
      
      // Parse the HTML
      const parser = new DOMParser();
      const document = parser.parseFromString(html, "text/html");
      
      if (!document) {
        console.error(`Failed to parse HTML from Google Jobs`);
        continue;
      }
      
      // Google Jobs structure: Each job card is in a div with role="article"
      const jobElements = document.querySelectorAll('[role="article"]');
      console.log(`Found ${jobElements.length} potential job listings on Google Jobs`);
      
      for (const jobElement of jobElements) {
        try {
          // Extract job details
          const titleElement = jobElement.querySelector('h3');
          const companyElement = jobElement.querySelector('[role="article"] > div:first-child > div:first-child > div:nth-child(2)');
          const locationElement = jobElement.querySelector('[role="article"] > div:first-child > div:first-child > div:nth-child(3)');
          
          // Skip if we can't find the title
          if (!titleElement) continue;
          
          const title = titleElement.textContent?.trim() || '';
          const company = companyElement?.textContent?.trim() || 'Unknown Company';
          const location = locationElement?.textContent?.trim() || 'Kenya';
          
          // Extract URL by finding the parent link
          const linkElement = titleElement.closest('a');
          let jobUrl = null;
          
          if (linkElement && linkElement.hasAttribute('href')) {
            let href = linkElement.getAttribute('href');
            
            // Clean up Google redirect URLs
            if (href.startsWith('/url?')) {
              const urlParams = new URLSearchParams(href.substring(5));
              href = urlParams.get('q') || href;
            }
            
            // Add domain if the URL is relative
            if (href.startsWith('/')) {
              href = `https://www.google.com${href}`;
            }
            
            jobUrl = href;
          }
          
          // Only add jobs that look like supply chain jobs
          if (hasSupplyChainKeywords(title)) {
            scrapedJobs.push({
              title,
              company,
              location,
              source: 'Google Jobs',
              job_type: 'full_time', // Default
              description: `${title} at ${company} in ${location}`,
              job_url: jobUrl,
              application_url: jobUrl
            });
          }
        } catch (error) {
          console.error('Error processing Google job listing:', error);
        }
      }
      
      console.log(`Found ${scrapedJobs.length} jobs for keyword: ${keyword}`);
    }
    
    return scrapedJobs;
  } catch (error) {
    console.error('Error scraping from Google Jobs:', error);
    return scrapedJobs;
  }
}

async function scrapeFromGoogleJobsApi(site: JobSite): Promise<Job[]> {
  const scrapedJobs: Job[] = [];
  try {
    console.log(`Scraping Google Jobs API at ${site.url}...`);
    
    // Fetch the Google Jobs API data
    const response = await fetch(site.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
      }
    });
    
    if (!response.ok) {
      console.error(`Error fetching Google Jobs API: ${response.status} ${response.statusText}`);
      return scrapedJobs;
    }
    
    const data = await response.json();
    console.log(`Received JSON from Google Jobs API, checking jobs_results...`);
    
    // Extract jobs from the API response
    if (data.jobs_results && Array.isArray(data.jobs_results)) {
      for (const jobResult of data.jobs_results) {
        if (hasSupplyChainKeywords(jobResult.title)) {
          scrapedJobs.push({
            title: jobResult.title,
            company: jobResult.company_name,
            location: jobResult.location || "Kenya",
            description: jobResult.description || `${jobResult.title} at ${jobResult.company_name}`,
            job_type: mapToStandardJobType(jobResult.detected_extensions?.schedule_type || "full_time"),
            source: "Google Jobs",
            job_url: jobResult.apply_link?.link || null,
            application_url: jobResult.apply_link?.link || null
          });
        }
      }
    }
    
    console.log(`Successfully scraped ${scrapedJobs.length} jobs from Google Jobs API`);
    return scrapedJobs;
  } catch (error) {
    console.error(`Error scraping Google Jobs API:`, error);
    return scrapedJobs;
  }
}

async function scrapeXmlFeed(site: JobSite): Promise<Job[]> {
  const scrapedJobs: Job[] = [];
  
  try {
    console.log(`Scraping XML feed from ${site.source} at ${site.url}...`);
    
    // Fetch the XML content
    const response = await fetch(site.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      console.error(`Error fetching XML feed ${site.url}: ${response.status} ${response.statusText}`);
      return scrapedJobs;
    }
    
    const xmlText = await response.text();
    console.log(`Received XML from ${site.source}, length: ${xmlText.length} chars`);
    
    // Parse the XML feed
    const items = parseXmlFeed(xmlText);
    console.log(`Parsed ${items.length} items from XML feed of ${site.source}`);
    
    // Process each item
    for (const item of items) {
      try {
        // Check if the job title contains supply chain keywords
        if (hasSupplyChainKeywords(item.title)) {
          const job: Job = {
            title: item.title,
            company: item.company || site.source,
            location: item.location || "Kenya",
            job_type: mapToStandardJobType(item.jobType || "full_time"),
            description: item.description || `${item.title} position`,
            job_url: item.link || null,
            application_url: item.link || null,
            source: site.source,
            deadline: item.expiryDate || null,
            tags: extractKeywordsFromText(item.title + " " + (item.description || ""))
          };
          
          scrapedJobs.push(job);
        }
      } catch (itemError) {
        console.error(`Error processing XML item from ${site.source}:`, itemError);
      }
    }
    
    console.log(`Successfully scraped ${scrapedJobs.length} jobs from XML feed of ${site.source}`);
    return scrapedJobs;
  } catch (error) {
    console.error(`Error scraping XML feed from ${site.source}:`, error);
    return scrapedJobs;
  }
}

function extractJobFromListing(listing: Element, site: JobSite): Job | null {
  const titleElement = listing.querySelector(site.selectors.title);
  const companyElement = listing.querySelector(site.selectors.company);
  const locationElement = listing.querySelector(site.selectors.location);
  const typeElement = site.selectors.jobType ? listing.querySelector(site.selectors.jobType) : null;
  const jobLinkElement = listing.querySelector(site.selectors.jobLink);
  
  if (!titleElement) {
    return null;
  }
  
  const title = titleElement.textContent?.trim() || 'Supply Chain Position';
  const company = companyElement?.textContent?.trim() || site.source;
  const location = locationElement?.textContent?.trim() || 'Kenya';
  const jobType = typeElement?.textContent?.trim()?.toLowerCase() || 'full_time';
  
  // Extract job URL
  let jobUrl = null;
  if (jobLinkElement && jobLinkElement.getAttribute('href')) {
    let href = jobLinkElement.getAttribute('href');
    // Add domain if the URL is relative
    if (href && href.startsWith('/')) {
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
    job_url: jobUrl,
    application_url: jobUrl  // Set application_url same as job_url for consistency
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
  
  // Look for links - check multiple scenarios
  const linkElement = element.closest('a') || 
                      jobContainer.querySelector('a[href]') || 
                      jobContainer.closest('a[href]');
  let jobUrl = null;
  
  if (linkElement && linkElement.getAttribute('href')) {
    let href = linkElement.getAttribute('href');
    // Add domain if the URL is relative
    if (href && href.startsWith('/')) {
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
    job_url: jobUrl,
    application_url: jobUrl  // Set application_url same as job_url for consistency
  };
}

function mapToStandardJobType(jobType: string): string {
  if (!jobType) return 'full_time';
  
  const jobTypeLower = jobType.toLowerCase();
  if (jobTypeLower.includes('part')) return 'part_time';
  if (jobTypeLower.includes('contract')) return 'contract';
  if (jobTypeLower.includes('intern')) return 'internship';
  return 'full_time';
}

function extractKeywordsFromText(text: string): string[] {
  const keywords = [
    'supply chain', 'logistics', 'procurement', 'warehouse', 'inventory',
    'shipping', 'distribution', 'operations', 'sourcing', 'purchasing',
    'scm', 'freight', 'supply', 'chain', 'transport', 'fleet', 'planning',
    'demand', 'forecasting', 'material', 'import', 'export', 'customs',
    'lean', 'six sigma', 'erp', 'sap', 'wms', 'tms'
  ];
  
  const textLower = text.toLowerCase();
  return keywords.filter(keyword => textLower.includes(keyword));
}
