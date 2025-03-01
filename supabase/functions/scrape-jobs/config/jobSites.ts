
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // LinkedIn Supply Chain jobs in Kenya
    {
      url: "https://www.linkedin.com/jobs/search/?keywords=supply%20chain&location=Kenya",
      source: "LinkedIn",
      selectors: {
        jobContainer: ".jobs-search__results-list li",
        title: ".base-search-card__title",
        company: ".base-search-card__subtitle",
        location: ".job-search-card__location",
        jobLink: ".base-card__full-link",
        jobType: null, // Not directly available in list view
        deadline: null, // Not directly available in list view
      }
    },
    // BrighterMonday Supply Chain jobs in Kenya
    {
      url: "https://www.brightermonday.co.ke/jobs/supply-chain",
      source: "BrighterMonday",
      selectors: {
        jobContainer: ".search-result",
        title: "h3",
        company: ".search-result__job-meta span:first-child",
        location: ".search-result__location",
        jobLink: "h3 a",
        jobType: ".search-result__job-type", // May need adjustment
        deadline: null, // Not directly available in list view
      }
    },
    // Fuzu Supply Chain jobs in Kenya
    {
      url: "https://www.fuzu.com/jobs?categories=Operations%2FSupply%20Chain&location=Kenya",
      source: "Fuzu",
      selectors: {
        jobContainer: ".JobsListingCard-module_wrapper__3b6PV",
        title: ".JobsListingCard-module_title__1aBWC",
        company: ".JobsListingCard-module_companyName__2SAfe",
        location: ".JobsListingCard-module_locationName__32H-w",
        jobLink: "a",
        jobType: null, // Not directly available in list view
        deadline: null, // Not directly available in list view
      }
    },
    // MyJobMag Supply Chain jobs in Kenya
    {
      url: "https://www.myjobmag.co.ke/jobs-by-field/logistics-transportation",
      source: "MyJobMag",
      selectors: {
        jobContainer: ".job-list-wrapper",
        title: ".job-title-text a",
        company: ".company-hiring-info",
        location: ".job-location-details",
        jobLink: ".job-title-text a",
        jobType: null, // Not directly available in list view
        deadline: null, // Not directly available in list view
      }
    },
    // JobWebKenya Supply Chain jobs
    {
      url: "https://jobwebkenya.com/supply-chain-jobs-in-kenya",
      source: "JobWebKenya",
      selectors: {
        jobContainer: ".card-content",
        title: ".card-title a",
        company: ".mdi-office-building",
        location: ".mdi-map-marker",
        jobLink: ".card-title a",
        jobType: null, // Not directly available in list view
        deadline: ".mdi-calendar-range", // May need adjustment
      }
    },
    // Indeed Supply Chain jobs in Kenya
    {
      url: "https://ke.indeed.com/jobs?q=supply%20chain&l=Kenya",
      source: "Indeed",
      selectors: {
        jobContainer: ".job_seen_beacon",
        title: ".jobTitle a",
        company: ".companyName",
        location: ".companyLocation",
        jobLink: ".jobTitle a",
        jobType: null, // Not directly available in list view
        deadline: null, // Not directly available in list view
      }
    }
  ];
};
