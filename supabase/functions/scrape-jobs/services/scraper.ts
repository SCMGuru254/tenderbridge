
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

  // Try multiple job container selectors
  const containerSelectors = jobSite.selectors.jobContainer.split(',').map(s => s.trim());
  let jobElements = $();
  
  for (const selector of containerSelectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      jobElements = elements;
      console.log(`🎯 Found ${elements.length} job containers with selector: ${selector}`);
      break;
    }
  }
  
  if (jobElements.length === 0) {
    console.log(`⚠️ No job containers found for ${jobSite.source} with any selector`);
    // Let's try to find ANY potential job containers
    const potentialContainers = $('.job, .vacancy, .listing, .card, .item, [class*="job"], [class*="vacancy"]');
    if (potentialContainers.length > 0) {
      jobElements = potentialContainers;
      console.log(`🔍 Found ${potentialContainers.length} potential job containers with fallback selectors`);
    } else {
      return [];
    }
  }
  
  console.log(`🔄 Processing ${jobElements.length} job elements for ${jobSite.source}`);
  
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
            console.log(`⚠️ Could not resolve URL for ${title}: ${jobUrl}`);
            jobUrl = '';
          }
        }
      }
      
      // Validate and filter jobs - be more lenient
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
          const jobType = extractText($element, jobSite.selectors.jobType, $);
          if (jobType) job.job_type = mapJobType(jobType);
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
  
  // If no specific selector worked, try to extract from element text
  const elementText = $element.text().trim();
  if (elementText && elementText.length > 0) {
    // Return first meaningful line of text
    const lines = elementText.split('\n').map(line => line.trim()).filter(line => line.length > 2);
    if (lines.length > 0) {
      return lines[0];
    }
  }
  
  return '';
}

function isValidJob(title: string, company: string | null, jobSite: JobSite): boolean {
  // Be more lenient with validation
  if (!title || title.length < 2) {
    return false;
  }
  
  // Skip obvious non-job content
  const skipWords = ['advertisement', 'sponsored', 'click here', 'see more', 'load more', 'view all'];
  if (skipWords.some(word => title.toLowerCase().includes(word))) {
    return false;
  }
  
  // Don't require keywords to be too strict - any logistics/supply chain related content is good
  if (jobSite.keywords && jobSite.keywords.length > 0) {
    const titleLower = title.toLowerCase();
    const companyLower = (company || '').toLowerCase();
    
    const relevantWords = ['supply', 'chain', 'logistics', 'warehouse', 'procurement', 'inventory', 'distribution', 'transport', 'shipping', 'coordinator', 'manager', 'officer', 'assistant'];
    
    const hasRelevantContent = relevantWords.some(word => 
      titleLower.includes(word) || companyLower.includes(word)
    );
    
    if (!hasRelevantContent) {
      return false;
    }
  }
  
  return true;
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-&()]/g, '')
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
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
