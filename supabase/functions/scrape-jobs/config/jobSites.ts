
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
    // MyJobMag Supply Chain jobs in Kenya - improved selectors
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
    // Direct Google Jobs search - improved implementation
    {
      url: "https://www.google.com/search?q=supply+chain+jobs+kenya&ibp=htl;jobs",
      source: "Google",
      selectors: {
        jobContainer: "div[jscontroller] > div[class='gws-plugins-horizon-jobs__tl-lif']",
        title: "div[role='heading']",
        company: "div:nth-child(1) > div:nth-child(2)",
        location: "div:nth-child(1) > div:nth-child(3)",
        jobLink: "a[jsname]",
        jobType: null,
        deadline: null,
      }
    },
    // PigiaMe Jobs in Kenya
    {
      url: "https://www.pigiame.co.ke/jobs?q=logistics",
      source: "PigiaMe",
      selectors: {
        jobContainer: ".listings__item",
        title: ".listings__title",
        company: ".listings__author",
        location: ".listings__address",
        jobLink: ".listings__title a",
        jobType: null,
        deadline: null
      }
    },
    // MyJobMag Widget Scraper (new approach)
    {
      url: "https://www.myjobmag.co.ke/search-results?q=supply+chain",
      source: "MyJobMag Direct",
      selectors: {
        jobContainer: ".job-list",
        title: "h2.job-title",
        company: ".company-name",
        location: ".job-location",
        jobLink: "h2.job-title a",
        jobType: ".job-type",
        deadline: ".job-deadline",
      }
    }
  ];
};
