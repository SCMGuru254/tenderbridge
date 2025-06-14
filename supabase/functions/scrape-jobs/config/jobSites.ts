
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // BrighterMonday Supply Chain jobs - more reliable scraping
    {
      url: "https://www.brightermonday.co.ke/jobs/supply-chain-management",
      source: "BrighterMonday",
      selectors: {
        jobContainer: ".search-result, .job-item, .job-card, .job-listing",
        title: ".job-title a, .title a, h3 a, .job-name a",
        company: ".company-name, .employer, .company",
        location: ".location, .job-location",
        jobLink: ".job-title a, .title a, h3 a",
        jobType: ".job-type, .employment-type",
        deadline: ".deadline, .expiry"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory']
    },
    
    // MyJobMag Supply Chain jobs
    {
      url: "https://www.myjobmag.co.ke/jobs-by-field/supply-chain",
      source: "MyJobMag",
      selectors: {
        jobContainer: ".job-list-wrapper, .job-item, .job",
        title: ".job-title-text a, .job-title a, .title",
        company: ".company-hiring-info, .company-name, .employer",
        location: ".job-location-details, .location",
        jobLink: ".job-title-text a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse']
    },
    
    // Fuzu Kenya jobs
    {
      url: "https://www.fuzu.com/kenya/jobs?query=supply%20chain%20logistics",
      source: "Fuzu",
      selectors: {
        jobContainer: ".job-card, .job-item, .job",
        title: ".job-title, .title, h3",
        company: ".company-name, .employer",
        location: ".location, .job-location",
        jobLink: "a"
      },
      keywords: ['supply chain', 'logistics', 'procurement']
    },
    
    // PigiaMe Jobs
    {
      url: "https://www.pigiame.co.ke/jobs?q=logistics+supply+chain",
      source: "PigiaMe",
      selectors: {
        jobContainer: ".listings__item, .job-item, .listing",
        title: ".listings__title, .title, h3",
        company: ".listings__author, .company",
        location: ".listings__address, .location",
        jobLink: ".listings__title a, a"
      },
      keywords: ['supply chain', 'logistics', 'procurement']
    },
    
    // JobWebKenya XML Feed - simplified
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
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse']
    }
  ];
};
