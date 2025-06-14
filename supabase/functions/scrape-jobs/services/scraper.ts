
import { load } from 'https://esm.sh/cheerio@1.0.0';
import { JobSite } from '../types/jobSite.ts';
import { Job } from '../types/job.ts';
import parseXmlJobs from '../utils/xmlJobParser.ts';

export async function scrapeJobSites(jobSite: JobSite): Promise<Job[]> {
  console.log(`🔍 Starting scrape for: ${jobSite.source} (${jobSite.url})`);
  
  try {
    // Handle XML feeds differently
    if (jobSite.isXmlFeed) {
      console.log(`📄 Processing XML feed for ${jobSite.source}`);
      return await scrapeXmlFeed(jobSite);
    }
    
    // Handle regular HTML scraping
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
        'User-Agent': 'Mozilla/5.0 (compatible; JobBot/1.0; +https://example.com/bot)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      signal: AbortSignal.timeout(jobSite.timeout || 30000)
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
    console.log(`✅ Parsed ${jobs.length} jobs from XML`);
    
    return jobs;
  } catch (error) {
    console.error(`❌ Error scraping XML feed ${jobSite.source}:`, error);
    return [];
  }
}

async function scrapeHtmlSite(jobSite: JobSite): Promise<Job[]> {
  const jobs: Job[] = [];
  let retries = 0;
  const maxRetries = jobSite.retryAttempts || 2;
  
  while (retries <= maxRetries) {
    try {
      console.log(`📡 Fetching HTML from: ${jobSite.url} (attempt ${retries + 1}/${maxRetries + 1})`);
      
      const response = await fetch(jobSite.url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: AbortSignal.timeout(jobSite.timeout || 30000)
      });
      
      if (!response.ok) {
        console.error(`❌ HTTP error for ${jobSite.source}: ${response.status} ${response.statusText}`);
        if (retries < maxRetries) {
          retries++;
          await delay(2000 * retries); // Exponential backoff
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
          await delay(3000 * retries);
          continue;
        }
        return [];
      }
      
      // Parse HTML and extract jobs
      const extractedJobs = await parseHtmlJobs(html, jobSite);
      console.log(`✅ Successfully extracted ${extractedJobs.length} jobs from ${jobSite.source}`);
      return extractedJobs;
      
    } catch (error) {
      console.error(`❌ Error scraping HTML site ${jobSite.source} (attempt ${retries + 1}):`, error);
      if (retries < maxRetries) {
        retries++;
        await delay(2000 * retries);
      } else {
        return [];
      }
    }
  }
  
  return jobs;
}

async function parseHtmlJobs(html: string, jobSite: JobSite): Promise<Job[]> {
  const jobs: Job[] = [];
  const $ = load(html);
  
  const pageTitle = $('title').text();
  console.log(`📄 Page title for ${jobSite.source}: ${pageTitle}`);

  // Use more aggressive job finding strategy
  let jobElements = $();
  
  // Try primary selectors first
  const containerSelectors = jobSite.selectors.jobContainer.split(',').map(s => s.trim());
  for (const selector of containerSelectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      jobElements = elements;
      console.log(`🎯 Found ${elements.length} job containers with selector: ${selector}`);
      break;
    }
  }
  
  // If no primary selectors work, try common job-related selectors
  if (jobElements.length === 0) {
    const fallbackSelectors = [
      '[class*="job"]',
      '[class*="vacancy"]', 
      '[class*="listing"]',
      '[class*="position"]',
      '[class*="career"]',
      'article',
      '.card',
      '.item',
      '[data-testid*="job"]',
      '[data-test*="job"]'
    ];
    
    for (const selector of fallbackSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        jobElements = elements;
        console.log(`🔍 Found ${elements.length} potential job containers with fallback selector: ${selector}`);
        break;
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
      
      // Extract job information with multiple selector attempts and fallbacks
      const title = extractTextWithFallbacks($element, jobSite.selectors.title, $);
      const company = extractTextWithFallbacks($element, jobSite.selectors.company, $);
      const location = extractTextWithFallbacks($element, jobSite.selectors.location, $);
      
      // Extract job URL with multiple attempts
      let jobUrl = '';
      if (jobSite.selectors.jobLink) {
        const linkElement = $element.find(jobSite.selectors.jobLink).first();
        jobUrl = linkElement.attr('href') || '';
        
        // Try alternative link selectors if none found
        if (!jobUrl) {
          const altSelectors = ['a', '[href]', '.link'];
          for (const selector of altSelectors) {
            const altLink = $element.find(selector).first();
            const href = altLink.attr('href');
            if (href && (href.includes('/job') || href.includes('career') || href.includes('vacancy'))) {
              jobUrl = href;
              break;
            }
          }
        }
        
        // Make relative URLs absolute
        if (jobUrl && !jobUrl.startsWith('http')) {
          try {
            const baseUrl = new URL(jobSite.url).origin;
            jobUrl = new URL(jobUrl, baseUrl).href;
          } catch (e) {
            console.log(`⚠️ Could not resolve URL for ${title}: ${jobUrl}`);
            jobUrl = '';
          }
        }
      }
      
      // More lenient validation - accept more potential jobs
      if (isValidJob(title, company, jobSite)) {
        const job: Job = {
          title: cleanTitle(title),
          company: company ? company.trim() : 'Company not specified',
          location: location ? location.trim() : 'Kenya',
          source: jobSite.source,
          job_url: jobUrl || undefined,
          application_url: jobUrl || undefined,
          description: '', 
          job_type: 'full_time',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Extract additional fields if available
        if (jobSite.selectors.jobType) {
          const jobType = extractTextWithFallbacks($element, jobSite.selectors.jobType, $);
          if (jobType) job.job_type = mapJobType(jobType);
        }
        
        if (jobSite.selectors.deadline) {
          const deadline = extractTextWithFallbacks($element, jobSite.selectors.deadline, $);
          if (deadline) {
            try {
              job.application_deadline = new Date(deadline).toISOString();
            } catch (e) {
              // Invalid date format, skip
            }
          }
        }
        
        jobs.push(job);
        console.log(`✅ Extracted: "${job.title}" at "${job.company}" from ${jobSite.source}`);
      } else {
        console.log(`⚠️ Skipped invalid job: "${title}" at "${company}" from ${jobSite.source}`);
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
      if (text && text.length > 0) {
        return text;
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  // Try common fallback selectors based on content type
  const fallbackSelectors = {
    title: ['h1', 'h2', 'h3', 'h4', '.title', '.job-title', '.position', '[class*="title"]'],
    company: ['.company', '.employer', '.organization', '[class*="company"]', '[class*="employer"]'],
    location: ['.location', '.area', '.city', '[class*="location"]', '[class*="area"]']
  };
  
  // Determine which fallbacks to use based on the original selector content
  let fallbacks: string[] = [];
  if (selectors.includes('title') || selectors.includes('h2') || selectors.includes('h3')) {
    fallbacks = fallbackSelectors.title;
  } else if (selectors.includes('company') || selectors.includes('employer')) {
    fallbacks = fallbackSelectors.company;
  } else if (selectors.includes('location') || selectors.includes('area')) {
    fallbacks = fallbackSelectors.location;
  }
  
  for (const fallback of fallbacks) {
    try {
      const text = $element.find(fallback).first().text().trim();
      if (text && text.length > 0) {
        return text;
      }
    } catch (e) {
      // Continue to next fallback
    }
  }
  
  return '';
}

function isValidJob(title: string, company: string | null, jobSite: JobSite): boolean {
  // More lenient validation
  if (!title || title.length < 3) {
    return false;
  }
  
  // Skip obvious non-job content
  const skipWords = ['advertisement', 'sponsored', 'click here', 'see more', 'load more', 'view all', 'register', 'login', 'sign up'];
  const titleLower = title.toLowerCase();
  if (skipWords.some(word => titleLower.includes(word))) {
    return false;
  }
  
  // Accept any job that looks legitimate - don't be too restrictive with keywords
  // Just filter out obvious spam or navigation elements
  if (titleLower.length < 10 && !titleLower.match(/\b(manager|officer|assistant|coordinator|analyst|specialist|executive)\b/)) {
    return false;
  }
  
  return true;
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-&().,]/g, '')
    .trim()
    .slice(0, 255);
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
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
