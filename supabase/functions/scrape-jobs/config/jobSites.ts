
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
    // JobWebKenya Supply Chain jobs - XML Feed
    {
      url: "https://jobwebkenya.com/feed/?post_type=job_listing",
      source: "JobWebKenya",
      selectors: {
        // These will be ignored as we'll use XML parsing instead
        jobContainer: "item",
        title: "title",
        company: "job_listing_company",
        location: "job_listing_location",
        jobLink: "link",
        jobType: "job_listing_job_type",
        deadline: "job_listing_expiry_date",
      },
      isXmlFeed: true // New flag to indicate this is an XML feed
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
    // MyJobMag Widget - more reliable approach
    {
      url: "https://www.myjobmag.co.ke/widget/feed.php?field=63,65&industry=0&keyword=supply%20chain&count=45",
      source: "MyJobMag Widget",
      selectors: {
        jobContainer: ".job-list",
        title: ".job-title a",
        company: ".company-name",
        location: ".job-location",
        jobLink: ".job-title a",
        jobType: ".job-type",
        deadline: ".job-deadline",
      }
    }
  ];
};
