import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";
import { JobSite } from "../types/jobSite.ts";
import { Job } from "../types/job.ts";
import { hasSupplyChainKeywords } from "../utils/jobFilters.ts";
import { parseXmlFeed } from "../utils/xmlParser.ts";
import { parseSupplyChainJobsXml } from "../utils/xmlJobParser.ts";

// Function to extract keywords from text for job tags
// Extract relevant keywords from job text to use as tags
function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];

  const lowerCaseText = text.toLowerCase();
  const keywords = new Set<string>();

  // Supply chain related keywords to extract
  const relevantKeywords = [
    'supply chain',
    'logistics',
    'procurement',
    'warehouse',
    'inventory',
    'shipping',
    'distribution',
    'scm',
    'operations',
    'sourcing',
    'purchasing',
    'freight',
    'transport',
    'planning',
    'demand',
    'forecasting',
    'material',
    'import',
    'export',
    'customs',
    'stock',
    'fulfillment',
    'replenishment',
    'delivery',
    'dispatch',
    'supply',
    'chain',
    'vendor',
    'supplier',
    'inbound',
    'outbound',
    'lean',
    'six sigma',
    'erp',
    'sap',
    'wms',
    'tms',
    'inventory control',
    'supply planning',
    'demand planning',
    'materials handling',
    'cold chain',
    'last mile',
    '3pl',
    '4pl'
  ];

  // Check for each keyword in the text
  for (const keyword of relevantKeywords) {
    if (lowerCaseText.includes(keyword)) {
      keywords.add(keyword);
    }
  }

  // Extract job level/seniority if present
  const seniorityLevels = ['junior', 'senior', 'lead', 'manager', 'director', 'head', 'chief', 'executive', 'assistant', 'coordinator', 'specialist', 'analyst', 'supervisor', 'officer', 'planner', 'controller'];

  for (const level of seniorityLevels) {
    if (lowerCaseText.includes(level)) {
      keywords.add(level);
    }
  }

  // Extract education requirements if present
  const educationKeywords = ['degree', 'bachelor', 'master', 'phd', 'diploma', 'certificate', 'certification', 'mba', 'bsc', 'msc'];

  for (const edu of educationKeywords) {
    if (lowerCaseText.includes(edu)) {
      keywords.add(edu);
    }
  }

  // Extract experience requirements
  const experiencePattern = /(\d+)[\s-]*(year|yr)s?/g;
  const experienceMatches = lowerCaseText.match(experiencePattern);

  if (experienceMatches) {
    for (const match of experienceMatches) {
      keywords.add(match.replace(/\s+/g, '-'));
    }
  }

  // Extract location information if present
  const locationKeywords = ['kenya', 'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'africa', 'east africa'];

  for (const location of locationKeywords) {
    if (lowerCaseText.includes(location)) {
      keywords.add(location);
    }
  }

  // Extract employment type information
  const employmentTypes = ['full-time', 'part-time', 'contract', 'temporary', 'permanent', 'internship', 'volunteer'];

  for (const type of employmentTypes) {
    if (lowerCaseText.includes(type)) {
      keywords.add(type);
    }
  }

  // Extract industry-specific terms
  const industryTerms = ['manufacturing', 'retail', 'fmcg', 'pharmaceutical', 'healthcare', 'agriculture', 'construction', 'automotive', 'e-commerce', 'food', 'beverage'];

  for (const term of industryTerms) {
    if (lowerCaseText.includes(term)) {
      keywords.add(term);
    }
  }

  // Limit the number of keywords to avoid overwhelming tags
  return Array.from(keywords).slice(0, 15);
}

export async function scrapeJobSites(jobSites: JobSite[], options: any = {}) {
  const results: any = {};
  
  for (const site of jobSites) {
    try {
      console.log(`Scraping jobs from: ${site.name}`);
      
      if (site.type === 'xml') {
        // Handle XML feeds
        const jobs = await parseXmlFeed(site.url, site.name);
        results[site.name] = {
          success: true,
          jobsFound: jobs.length,
          jobs: jobs
        };
      } else {
        // Handle regular web scraping
        const response = await fetch(site.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; JobBot/1.0)',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const html = await response.text();
        const jobs = await scrapeJobsFromHtml(html, site);
        
        results[site.name] = {
          success: true,
          jobsFound: jobs.length,
          jobs: jobs
        };
      }
    } catch (error) {
      console.error(`Error scraping ${site.name}:`, error);
      results[site.name] = {
        success: false,
        error: error.message,
        jobs: []
      };
    }
  }
  
  return results;
}

async function scrapeJobsFromHtml(html: string, site: JobSite): Promise<Job[]> {
  const jobs: Job[] = [];
  
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) return jobs;
    
    // Basic job extraction logic
    const jobElements = doc.querySelectorAll(site.selectors?.job || '.job, .job-item, .job-listing');
    
    for (const element of jobElements) {
      try {
        const title = element.querySelector(site.selectors?.title || '.title, .job-title, h2, h3')?.textContent?.trim();
        const company = element.querySelector(site.selectors?.company || '.company, .employer')?.textContent?.trim();
        const location = element.querySelector(site.selectors?.location || '.location, .job-location')?.textContent?.trim();
        const description = element.querySelector(site.selectors?.description || '.description, .job-description')?.textContent?.trim();
        const salary = element.querySelector(site.selectors?.salary || '.salary, .compensation, .pay')?.textContent?.trim();
        const experience = element.querySelector(site.selectors?.experience || '.experience, .requirements, .qualifications')?.textContent?.trim();
        const skills = Array.from(element.querySelectorAll(site.selectors?.skills || '.skills li, .requirements li, .qualifications li'))
          .map(el => el.textContent?.trim())
          .filter(Boolean);
        const employmentType = element.querySelector(site.selectors?.employmentType || '.employment-type, .job-type')?.textContent?.trim();
        const deadline = element.querySelector(site.selectors?.deadline || '.deadline, .closing-date')?.textContent?.trim();
        const isRemote = element.querySelector(site.selectors?.remote || '.remote, .work-location')?.textContent?.toLowerCase().includes('remote');
        const companyWebsite = element.querySelector(site.selectors?.companyWebsite || '.company-website, .website')?.getAttribute('href');
        const companyDescription = element.querySelector(site.selectors?.companyDescription || '.company-description, .about-company')?.textContent?.trim();
        
        if (title && hasSupplyChainKeywords(title + ' ' + (description || ''))) {
          const job: Job = {
            title: title,
            company: company || 'Not specified',
            location: location || 'Kenya',
            description: description || '',
            source: site.name,
            job_url: site.url,
            tags: extractKeywordsFromText(title + ' ' + (description || '')),
            salary: salary || null,
            experience_level: experience || null,
            skills: skills.length > 0 ? skills : null,
            employment_type: employmentType || null,
            deadline: deadline || null,
            is_remote: isRemote || false,
            company_website: companyWebsite || null,
            company_description: companyDescription || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          jobs.push(job);
        }
      } catch (error) {
        console.error('Error processing job element:', error);
        continue;
      }
    }
  } catch (error) {
    console.error('Error parsing HTML:', error);
  }
  
  return jobs;
}
