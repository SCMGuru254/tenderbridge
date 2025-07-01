import { load } from 'https://esm.sh/cheerio@1.0.0';
import { JobSite } from '../types/jobSite.ts';
import { Job } from '../types/job.ts';
import parseXmlJobs from '../utils/xmlJobParser.ts';

export async function scrapeJobSites(jobSite: JobSite): Promise<Job[]> {
  console.log(`🔍 Starting enhanced scrape for: ${jobSite.source} (${jobSite.url})`);
  
  try {
    // Handle XML feeds differently
    if (jobSite.isXmlFeed) {
      console.log(`📄 Processing XML feed for ${jobSite.source}`);
      return await scrapeXmlFeed(jobSite);
    }
    
    // Handle regular HTML scraping with enhanced extraction
    console.log(`🌐 Processing HTML scraping for ${jobSite.source}`);
    return await scrapeHtmlSite(jobSite);
  } catch (error) {
    console.error(`❌ Error scraping ${jobSite.source}:`, error);
    return [];
  }
}

async function scrapeXmlFeed(jobSite: JobSite): Promise<Job[]> {
  try {
    console.log(`📡 Fetching XML from: ${jobSite.url}`);
    
    const response = await fetch(jobSite.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SupplyChainJobBot/1.0; +https://supplychainjobs.co.ke/bot)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml'
      },
      signal: AbortSignal.timeout(jobSite.timeout || 45000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log(`📊 XML response length: ${xmlText.length} characters`);
    
    if (xmlText.length < 100) {
      console.warn(`⚠️ XML response too short for ${jobSite.source}`);
      return [];
    }
    
    // Parse XML jobs using the utility function
    const jobs = await parseXmlJobs(xmlText, jobSite);
    
    // Enhanced validation: Filter out any jobs with placeholder data
    const validJobs = jobs.filter(job => {
      return isValidJobData(job.title, job.company, job.location, jobSite.source);
    });
    
    console.log(`✅ Parsed ${jobs.length} raw jobs, ${validJobs.length} valid jobs from XML`);
    
    return validJobs;
  } catch (error) {
    console.error(`❌ Error scraping XML feed ${jobSite.source}:`, error);
    return [];
  }
}

async function scrapeHtmlSite(jobSite: JobSite): Promise<Job[]> {
  const jobs: Job[] = [];
  let retries = 0;
  const maxRetries = jobSite.retryAttempts || 3;
  
  while (retries <= maxRetries) {
    try {
      console.log(`📡 Fetching HTML from: ${jobSite.url} (attempt ${retries + 1}/${maxRetries + 1})`);
      
      const response = await fetch(jobSite.url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,sw;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referer': 'https://www.google.com/',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site'
        },
        signal: AbortSignal.timeout(jobSite.timeout || 45000)
      });
      
      if (!response.ok) {
        console.error(`❌ HTTP error for ${jobSite.source}: ${response.status} ${response.statusText}`);
        if (retries < maxRetries) {
          retries++;
          await delay(3000 * retries); // Exponential backoff
          continue;
        }
        return [];
      }
      
      const html = await response.text();
      console.log(`📊 HTML response length for ${jobSite.source}: ${html.length} characters`);
      
      if (html.length < 1000) {
        console.error(`⚠️ Response too short for ${jobSite.source}, likely blocked or empty`);
        if (retries < maxRetries) {
          retries++;
          await delay(5000 * retries);
          continue;
        }
        return [];
      }
      
      // Enhanced HTML parsing and job extraction
      const extractedJobs = await parseHtmlJobsEnhanced(html, jobSite);
      console.log(`✅ Successfully extracted ${extractedJobs.length} valid jobs from ${jobSite.source}`);
      return extractedJobs;
      
    } catch (error) {
      console.error(`❌ Error scraping HTML site ${jobSite.source} (attempt ${retries + 1}):`, error);
      if (retries < maxRetries) {
        retries++;
        await delay(3000 * retries);
      } else {
        return [];
      }
    }
  }
  
  return jobs;
}

async function parseHtmlJobsEnhanced(html: string, jobSite: JobSite): Promise<Job[]> {
  const jobs: Job[] = [];
  const $ = load(html);
  
  const pageTitle = $('title').text();
  console.log(`📄 Page title for ${jobSite.source}: ${pageTitle}`);

  // Enhanced job finding strategy with multiple selector attempts
  let jobElements = $();
  
  // Try primary selectors first
  const containerSelectors = jobSite.selectors.jobContainer.split(',').map(s => s.trim());
  for (const selector of containerSelectors) {
    try {
      const elements = $(selector);
      if (elements.length > 0) {
        jobElements = elements;
        console.log(`🎯 Found ${elements.length} job containers with selector: ${selector}`);
        break;
      }
    } catch (e) {
      console.log(`⚠️ Invalid selector: ${selector}`);
    }
  }
  
  // Enhanced fallback selectors for better job detection
  if (jobElements.length === 0) {
    const enhancedFallbackSelectors = [
      '[class*="job"]',
      '[class*="vacancy"]', 
      '[class*="listing"]',
      '[class*="position"]',
      '[class*="career"]',
      '[data-job]',
      '[data-testid*="job"]',
      '[data-test*="job"]',
      'article',
      '.card',
      '.item',
      '.post',
      '.entry',
      'li[class*="job"]',
      'div[class*="job"]'
    ];
    
    for (const selector of enhancedFallbackSelectors) {
      try {
        const elements = $(selector);
        if (elements.length > 0 && elements.length < 500) { // Reasonable number
          jobElements = elements;
          console.log(`🔍 Found ${elements.length} potential job containers with fallback selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
  }
  
  if (jobElements.length === 0) {
    console.log(`⚠️ No job containers found for ${jobSite.source} with any selector`);
    return [];
  }
  
  console.log(`🔄 Processing ${jobElements.length} job elements for ${jobSite.source}`);
  
  jobElements.each((index, element) => {
    try {
      const $element = $(element);
      
      // Enhanced extraction with multiple attempts and cleaning
      const rawTitle = extractTextWithFallbacks($element, jobSite.selectors.title, $);
      const rawCompany = extractTextWithFallbacks($element, jobSite.selectors.company, $);
      const rawLocation = extractTextWithFallbacks($element, jobSite.selectors.location, $);
      
      // Clean and validate the extracted data
      const title = cleanTitle(rawTitle);
      const company = cleanCompanyName(rawCompany);
      const location = cleanLocation(rawLocation);
      
      // Enhanced job URL extraction
      let jobUrl = '';
      if (jobSite.selectors.jobLink) {
        jobUrl = extractJobUrl($element, jobSite.selectors.jobLink, jobSite.url);
      }
      
      // Enhanced posting date extraction
      let sourcePostedAt: string | undefined = undefined;
      if (jobSite.selectors.postedAt) {
        const postedAtText = extractTextWithFallbacks($element, jobSite.selectors.postedAt, $);
        if (postedAtText && postedAtText.length > 0) {
          const parsedDate = new Date(postedAtText);
          if (!isNaN(parsedDate.getTime())) {
            sourcePostedAt = parsedDate.toISOString();
          }
        }
      }
      // Fallback: look for <time> tags
      if (!sourcePostedAt) {
        const timeTag = $element.find('time[datetime]').attr('datetime');
        if (timeTag) {
          const parsedDate = new Date(timeTag);
          if (!isNaN(parsedDate.getTime())) {
            sourcePostedAt = parsedDate.toISOString();
          }
        }
      }
      // Ultimate fallback: now
      if (!sourcePostedAt) {
        sourcePostedAt = new Date().toISOString();
      }
      
      // STRICT VALIDATION: Only proceed with jobs that have valid data
      if (isValidJobData(title, company, location, jobSite.source)) {
        // Extract description if available
        let description = '';
        if (jobSite.selectors.description) {
          const rawDescription = extractTextWithFallbacks($element, jobSite.selectors.description, $);
          description = cleanJobDescription(rawDescription);
        }
        
        const job: Job = {
          title: title,
          company: company || 'Company Name Available on Site',
          location: location || 'Kenya',
          source: jobSite.source,
          job_url: jobUrl || undefined,
          application_url: jobUrl || undefined,
          description: description,
          job_type: 'full_time',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source_posted_at: sourcePostedAt
        };
        
        // Extract additional fields if available
        if (jobSite.selectors.jobType) {
          const jobType = extractTextWithFallbacks($element, jobSite.selectors.jobType, $);
          if (jobType && jobType.length > 0) {
            job.job_type = mapJobType(jobType);
          }
        }
        
        if (jobSite.selectors.deadline) {
          const deadline = extractTextWithFallbacks($element, jobSite.selectors.deadline, $);
          if (deadline && deadline.length > 5) {
            try {
              const parsedDate = new Date(deadline);
              if (!isNaN(parsedDate.getTime())) {
                job.application_deadline = parsedDate.toISOString();
              }
            } catch (e) {
              // Invalid date format, skip
            }
          }
        }
        
        jobs.push(job);
        console.log(`✅ Extracted valid job: "${job.title}" at "${job.company}" in "${job.location}" from ${jobSite.source}`);
      } else {
        console.log(`🚫 Rejected invalid job data: title="${rawTitle}" company="${rawCompany}" location="${rawLocation}" from ${jobSite.source}`);
      }
    } catch (error) {
      console.error(`❌ Error processing job element ${index} from ${jobSite.source}:`, error);
    }
  });
  
  return jobs;
}

function extractTextWithFallbacks($element: any, selectors: string, $: any): string {
  if (!selectors) return '';
  
  const selectorList = selectors.split(',').map(s => s.trim());
  
  // Try each selector
  for (const selector of selectorList) {
    try {
      const text = $element.find(selector).first().text().trim();
      if (text && text.length > 0 && !isPlaceholderText(text)) {
        return text;
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  // Enhanced fallback selectors based on content type
  const enhancedFallbacks = {
    title: ['h1', 'h2', 'h3', 'h4', 'h5', '.title', '.job-title', '.position', '.role', '[class*="title"]', '[class*="job"]', 'strong', 'b'],
    company: ['.company', '.employer', '.organization', '.firm', '[class*="company"]', '[class*="employer"]', '[class*="org"]'],
    location: ['.location', '.area', '.city', '.region', '.place', '[class*="location"]', '[class*="area"]', '[class*="city"]']
  };
  
  // Determine which fallbacks to use
  let fallbacks: string[] = [];
  const selectorContent = selectors.toLowerCase();
  if (selectorContent.includes('title') || selectorContent.includes('job') || selectorContent.includes('position')) {
    fallbacks = enhancedFallbacks.title;
  } else if (selectorContent.includes('company') || selectorContent.includes('employer')) {
    fallbacks = enhancedFallbacks.company;
  } else if (selectorContent.includes('location') || selectorContent.includes('area')) {
    fallbacks = enhancedFallbacks.location;
  }
  
  for (const fallback of fallbacks) {
    try {
      const text = $element.find(fallback).first().text().trim();
      if (text && text.length > 0 && !isPlaceholderText(text)) {
        return text;
      }
    } catch (e) {
      // Continue to next fallback
    }
  }
  
  return '';
}

function extractJobUrl($element: any, linkSelectors: string, baseUrl: string): string {
  const selectors = linkSelectors.split(',').map(s => s.trim());
  
  for (const selector of selectors) {
    try {
      const linkElement = $element.find(selector).first();
      let href = linkElement.attr('href');
      
      if (href) {
        // Make relative URLs absolute
        if (!href.startsWith('http')) {
          try {
            const baseUrlObj = new URL(baseUrl);
            href = new URL(href, baseUrlObj.origin).href;
          } catch (e) {
            console.log(`⚠️ Could not resolve URL: ${href}`);
            continue;
          }
        }
        
        // Validate that the URL looks like a job URL
        if (isValidJobUrl(href)) {
          return href;
        }
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  // Try alternative approaches
  const altSelectors = ['a[href*="job"]', 'a[href*="career"]', 'a[href*="vacancy"]', 'a[href*="position"]', 'a'];
  for (const selector of altSelectors) {
    try {
      const links = $element.find(selector);
      for (let i = 0; i < links.length; i++) {
        const href = $(links[i]).attr('href');
        if (href && isValidJobUrl(href)) {
          if (!href.startsWith('http')) {
            try {
              const baseUrlObj = new URL(baseUrl);
              return new URL(href, baseUrlObj.origin).href;
            } catch (e) {
              continue;
            }
          }
          return href;
        }
      }
    } catch (e) {
      // Continue
    }
  }
  
  return '';
}

function isValidJobData(title: string, company: string, location: string, source: string): boolean {
  // Title validation
  if (!title || title.length < 3) {
    console.log(`🚫 Invalid title from ${source}: "${title}"`);
    return false;
  }
  
  // Check for placeholder patterns in title
  if (isPlaceholderText(title)) {
    console.log(`🚫 Placeholder title detected from ${source}: "${title}"`);
    return false;
  }
  
  // Must contain actual letters
  if (!/[a-zA-Z]{3,}/.test(title)) {
    console.log(`🚫 Title lacks sufficient letters from ${source}: "${title}"`);
    return false;
  }
  
  // Company validation (allow empty but not placeholder)
  if (company && isPlaceholderText(company)) {
    console.log(`🚫 Placeholder company detected from ${source}: "${company}"`);
    return false;
  }
  
  // Location validation (allow empty but not placeholder)
  if (location && isPlaceholderText(location)) {
    console.log(`🚫 Placeholder location detected from ${source}: "${location}"`);
    return false;
  }
  
  // Skip obvious non-job content
  const skipWords = ['advertisement', 'sponsored', 'click here', 'see more', 'load more', 'view all', 'register', 'login', 'sign up', 'home', 'about', 'contact'];
  const titleLower = title.toLowerCase();
  if (skipWords.some(word => titleLower.includes(word))) {
    console.log(`🚫 Non-job content detected from ${source}: "${title}"`);
    return false;
  }
  
  return true;
}

function isPlaceholderText(text: string): boolean {
  if (!text || typeof text !== 'string') return true;
  
  const placeholderPatterns = [
    /^\*+$/,                          // Only asterisks
    /\*{2,}/,                         // Two or more consecutive asterisks
    /^[\*\-\s]+$/,                    // Only asterisks, dashes, and spaces
    /^\s*[\*\-]+\s*[\(\)]*\s*$/,     // Asterisks/dashes with optional parentheses
    /^null$/i,                        // literal "null"
    /^undefined$/i,                   // literal "undefined"
    /^[\s\-\(\)]*$/,                  // Only spaces, dashes, parentheses
    /\*+.*\*+/,                       // Asterisks at beginning and end
    /^[^a-zA-Z]*$/,                   // No letters at all
    /^\d+$/,                          // Only numbers
    /^[^\w\s]*$/,                     // Only special characters
  ];
  
  return placeholderPatterns.some(pattern => pattern.test(text.trim()));
}

function isValidJobUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url); // Basic URL validation
    
    // Must look like a job-related URL
    const jobIndicators = ['job', 'career', 'vacancy', 'position', 'opportunity', 'hiring', 'employment'];
    const urlLower = url.toLowerCase();
    
    return jobIndicators.some(indicator => urlLower.includes(indicator));
  } catch (e) {
    return false;
  }
}

function cleanTitle(title: string): string {
  if (!title || typeof title !== 'string') return '';
  
  return title
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-&().,]/g, '')
    .trim()
    .slice(0, 255);
}

function cleanCompanyName(company: string): string {
  if (!company || typeof company !== 'string') return '';
  
  return company
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-&().,]/g, '')
    .trim()
    .slice(0, 200);
}

function cleanLocation(location: string): string {
  if (!location || typeof location !== 'string') return '';
  
  return location
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-&().,]/g, '')
    .trim()
    .slice(0, 100);
}

function cleanJobDescription(description: string): string {
  if (!description || typeof description !== 'string') return '';
  
  // Remove HTML tags and clean up
  let cleaned = description
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Must have meaningful content
  if (cleaned.length < 10 || isPlaceholderText(cleaned)) {
    return '';
  }
  
  return cleaned.slice(0, 5000); // Reasonable limit
}

function mapJobType(jobType: string): string {
  const type = jobType.toLowerCase();
  if (type.includes('full') || type.includes('permanent')) return 'full_time';
  if (type.includes('part')) return 'part_time';
  if (type.includes('contract') || type.includes('temp')) return 'contract';
  if (type.includes('intern')) return 'internship';
  return 'full_time';
}

function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
