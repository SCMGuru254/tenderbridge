
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";
import { JobSite } from "../types/jobSite.ts";
import { Job } from "../types/job.ts";
import { hasSupplyChainKeywords } from "../utils/jobFilters.ts";
import { parseXmlFeed } from "../utils/xmlParser.ts";
import { parseSupplyChainJobsXml } from "../utils/xmlJobParser.ts";

// Function to extract keywords from text for job tags
// Extract relevant keywords from job text to use as tags
function extractKeywordsFromText(...args: [text: string]): string[] {
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
}
