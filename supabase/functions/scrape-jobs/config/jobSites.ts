
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // BrighterMonday - Working selectors
    {
      url: "https://www.brightermonday.co.ke/search/jobs/supply-chain-logistics",
      source: "BrighterMonday",
      selectors: {
        jobContainer: ".search-card, .job-list-item, .vacancy-item",
        title: ".job-title a, .position-title, h3 a",
        company: ".company-name, .employer-name, .company",
        location: ".location, .job-location, .area",
        jobLink: "a",
        jobType: ".job-type, .employment-type",
        deadline: ".deadline, .expiry-date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'distribution'],
      retryAttempts: 3,
      timeout: 30000
    },
    
    // MyJobMag - Working selectors
    {
      url: "https://www.myjobmag.co.ke/jobs/logistics-supply-chain",
      source: "MyJobMag", 
      selectors: {
        jobContainer: ".job-item, .job-listing, .vacancy-card",
        title: ".job-title, .title, h2 a",
        company: ".company, .employer, .company-name",
        location: ".location, .job-location, .area",
        jobLink: "a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'operations'],
      retryAttempts: 3,
      timeout: 30000
    },
    
    // PigiaMe Jobs - Alternative local source
    {
      url: "https://www.pigiame.co.ke/jobs/logistics-transport",
      source: "PigiaMe",
      selectors: {
        jobContainer: ".listing-item, .job-card, .ad-item",
        title: ".listing-title a, .job-title, h3 a",
        company: ".company-name, .poster-name, .business-name",
        location: ".location, .area, .region",
        jobLink: "a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'transport'],
      retryAttempts: 2,
      timeout: 25000
    },

    // Corporate Staffing - Known working site
    {
      url: "https://www.corporatestaffing.co.ke/job-category/logistics-supply-chain/",
      source: "CorporateStaffing",
      selectors: {
        jobContainer: ".job-listing, .position-card, .vacancy-item",
        title: ".job-title a, .position-title, h3 a",
        company: ".company-name, .employer, .client-name",
        location: ".location, .job-location, .area",
        jobLink: "a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 2,
      timeout: 25000
    }
  ];
};
