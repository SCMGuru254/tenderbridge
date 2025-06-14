
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // BrighterMonday - Updated selectors
    {
      url: "https://www.brightermonday.co.ke/jobs/supply-chain-management",
      source: "BrighterMonday",
      selectors: {
        jobContainer: ".job-card, .vacancy-card, .job-listing, [data-testid='job-card'], .search-result-item",
        title: ".job-title, .vacancy-title, h3, .title, [data-testid='job-title']",
        company: ".company-name, .employer-name, .company, [data-testid='company-name']",
        location: ".location, .job-location, [data-testid='location']",
        jobLink: "a, .job-link, [data-testid='job-link']",
        jobType: ".job-type, .employment-type",
        deadline: ".deadline, .expiry-date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'distribution'],
      retryAttempts: 3,
      timeout: 30000
    },
    
    // MyJobMag - Updated selectors
    {
      url: "https://www.myjobmag.co.ke/jobs-by-field/supply-chain",
      source: "MyJobMag", 
      selectors: {
        jobContainer: ".job-card, .job-listing, .vacancy, .job-item, .search-result",
        title: ".job-title, .title, h3, .position-title",
        company: ".company, .employer, .company-name",
        location: ".location, .job-location",
        jobLink: "a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'operations'],
      retryAttempts: 3,
      timeout: 30000
    },
    
    // JobWebKenya RSS Feed - Fixed XML parsing
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

    // Add a working RSS feed as backup
    {
      url: "https://www.fuzu.com/kenya/jobs.rss?query=supply+chain",
      source: "Fuzu",
      selectors: {
        jobContainer: "item",
        title: "title",
        company: "description",
        location: "description",
        jobLink: "link"
      },
      isXmlFeed: true,
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 2,
      timeout: 25000
    }
  ];
};
