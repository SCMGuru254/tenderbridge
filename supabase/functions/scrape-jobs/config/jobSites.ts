
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // BrighterMonday - Kenya's leading job portal
    {
      url: "https://www.brightermonday.co.ke/jobs/supply-chain-management",
      source: "BrighterMonday",
      selectors: {
        jobContainer: ".job-item, .search-result, .vacancy-item, .listing-item",
        title: ".job-title a, .title a, h3 a, .job-name a, .position-title",
        company: ".company-name, .employer, .company, .hiring-company",
        location: ".location, .job-location, .place",
        jobLink: ".job-title a, .title a, h3 a, .position-title a",
        jobType: ".job-type, .employment-type, .contract-type",
        deadline: ".deadline, .expiry, .closing-date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'distribution'],
      retryAttempts: 3,
      timeout: 30000
    },
    
    // MyJobMag - Popular Kenyan job site
    {
      url: "https://www.myjobmag.co.ke/jobs-by-field/supply-chain",
      source: "MyJobMag", 
      selectors: {
        jobContainer: ".job-list-wrapper, .job-item, .job, .vacancy",
        title: ".job-title-text a, .job-title a, .title, h3",
        company: ".company-hiring-info, .company-name, .employer, .company",
        location: ".job-location-details, .location, .place",
        jobLink: ".job-title-text a, .job-title a, a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'operations'],
      retryAttempts: 3,
      timeout: 30000
    },
    
    // Fuzu Kenya - Tech and professional jobs
    {
      url: "https://www.fuzu.com/kenya/jobs?query=supply%20chain%20logistics",
      source: "Fuzu",
      selectors: {
        jobContainer: ".job-card, .job-item, .job, .opportunity",
        title: ".job-title, .title, h3, .position",
        company: ".company-name, .employer, .organization",
        location: ".location, .job-location, .place",
        jobLink: "a, .job-link"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'operations'],
      retryAttempts: 2,
      timeout: 25000
    },
    
    // PigiaMe Jobs - Classified ads including jobs
    {
      url: "https://www.pigiame.co.ke/jobs?q=logistics+supply+chain",
      source: "PigiaMe",
      selectors: {
        jobContainer: ".listings__item, .job-item, .listing, .ad-item",
        title: ".listings__title, .title, h3, .ad-title",
        company: ".listings__author, .company, .advertiser",
        location: ".listings__address, .location, .place",
        jobLink: ".listings__title a, a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 2,
      timeout: 25000
    },
    
    // JobWebKenya RSS Feed
    {
      url: "https://jobwebkenya.com/feed/?post_type=job_listing",
      source: "JobWebKenya",
      selectors: {
        jobContainer: "item",
        title: "title",
        company: "description",
        location: "description", 
        jobLink: "link"
      },
      isXmlFeed: true,
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'operations'],
      retryAttempts: 3,
      timeout: 30000
    },

    // Add more Kenyan job sites
    {
      url: "https://www.corporate-staffing.com/job-search/?keywords=supply+chain",
      source: "Corporate Staffing",
      selectors: {
        jobContainer: ".job-listing, .position, .opportunity",
        title: ".job-title, h3, .position-title",
        company: ".company, .employer, .client",
        location: ".location, .place",
        jobLink: "a, .job-link"
      },
      keywords: ['supply chain', 'logistics', 'procurement'],
      retryAttempts: 2,
      timeout: 25000
    },

    {
      url: "https://www.kenyajob.com/jobs?q=logistics",
      source: "KenyaJob",
      selectors: {
        jobContainer: ".job-item, .vacancy, .position",
        title: ".job-title, h3, .title",
        company: ".company, .employer",
        location: ".location, .place",
        jobLink: "a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 2,
      timeout: 25000
    }
  ];
};
