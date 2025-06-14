
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // BrighterMonday - Updated with working URL
    {
      url: "https://www.brightermonday.co.ke/jobs?q=supply+chain",
      source: "BrighterMonday",
      selectors: {
        jobContainer: ".job-item, .job-card, .search-result-item, article",
        title: "h2 a, h3 a, .job-title, .title",
        company: ".company, .employer, .company-name",
        location: ".location, .job-location, .area",
        jobLink: "h2 a, h3 a, .job-title a",
        jobType: ".job-type, .employment-type",
        deadline: ".deadline, .expiry-date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'distribution'],
      retryAttempts: 2,
      timeout: 25000
    },
    
    // MyJobMag - Updated with correct URL structure
    {
      url: "https://www.myjobmag.co.ke/search/jobs?q=supply+chain",
      source: "MyJobMag", 
      selectors: {
        jobContainer: ".job-card, .job-item, .listing-item, article",
        title: "h2 a, h3 a, .job-title, .title",
        company: ".company, .employer, .company-name",
        location: ".location, .job-location, .area",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'operations'],
      retryAttempts: 2,
      timeout: 25000
    },
    
    // Fuzu - Working Kenyan job site
    {
      url: "https://www.fuzu.com/kenya/jobs?search=supply+chain",
      source: "Fuzu",
      selectors: {
        jobContainer: ".job-card, .job-item, .listing, article",
        title: "h2 a, h3 a, .job-title, .title",
        company: ".company, .employer, .company-name",
        location: ".location, .job-location, .area",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'transport'],
      retryAttempts: 2,
      timeout: 25000
    },

    // JobsInKenya - Alternative local source
    {
      url: "https://www.jobsinkenya.co.ke/search?q=logistics",
      source: "JobsInKenya",
      selectors: {
        jobContainer: ".job-listing, .job-card, .vacancy-item, article",
        title: "h2 a, h3 a, .job-title, .title",
        company: ".company-name, .employer, .client-name",
        location: ".location, .job-location, .area",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 2,
      timeout: 25000
    },

    // Glassdoor Kenya - More lenient scraping
    {
      url: "https://www.glassdoor.com/Job/kenya-supply-chain-jobs-SRCH_IL.0,5_IN117_KO6,18.htm",
      source: "Glassdoor",
      selectors: {
        jobContainer: "[data-test='jobListing'], .react-job-listing, .job-search-card, article",
        title: "a[data-test='job-title'], .job-title, h2 a",
        company: "[data-test='employer-name'], .company, .employer",
        location: ".location, [data-test='job-location']",
        jobLink: "a[data-test='job-title'], .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 1,
      timeout: 20000
    }
  ];
};
