
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
        jobType: null,
        deadline: null,
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
        jobType: ".search-result__job-type",
        deadline: null,
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
        jobType: null,
        deadline: null,
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
        jobType: null,
        deadline: ".mdi-calendar-range",
      }
    },
    // Google Jobs (via job API endpoint)
    {
      url: "https://serpapi.com/search.json?engine=google_jobs&q=supply%20chain%20kenya&hl=en&gl=ke",
      source: "Google",
      selectors: {
        // This is a special API source, selectors don't apply the same way
        jobContainer: "jobs_results.results",
        title: "title",
        company: "company_name",
        location: "location",
        jobLink: "apply_link.link",
        jobType: "detected_extensions.schedule_type",
        deadline: null,
      }
    },
  ];
};
