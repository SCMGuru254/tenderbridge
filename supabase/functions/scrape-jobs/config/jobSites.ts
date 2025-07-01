
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // Google Jobs API approach - most reliable
    {
      url: "https://www.google.com/search?q=supply+chain+jobs+kenya&ibp=htl;jobs",
      source: "Google Jobs",
      selectors: {
        jobContainer: "[data-jk], .job_seen_beacon, .slider_container .slider_item",
        title: "[data-jk] h2 a span[title], .jobTitle a span[title], h2.jobTitle a span",
        company: "[data-jk] .companyName a, .companyName span, .companyName",
        location: "[data-jk] .companyLocation, .companyLocation",
        jobLink: "[data-jk] h2 a, .jobTitle a",
        description: ".jobSnippet, .job-snippet",
        postedAt: ".date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'distribution', 'operations'],
      retryAttempts: 3,
      timeout: 30000
    },

    // LinkedIn Jobs - Enhanced selectors
    {
      url: "https://www.linkedin.com/jobs/search/?keywords=supply%20chain%20logistics%20procurement&location=Kenya&f_TPR=r604800&f_JT=F%2CC",
      source: "LinkedIn",
      selectors: {
        jobContainer: ".job-search-card, .jobs-search__results-list li, [data-job-id], .job-card-container",
        title: ".job-search-card__title a, h3 a, .job-title a, .job-card-list__title",
        company: ".job-search-card__subtitle-primary-grouping a, .company-name, .job-card-container__company-name",
        location: ".job-search-card__subtitle-secondary-grouping, .job-card-container__metadata-item",
        jobLink: ".job-search-card__title a, h3 a, .job-title a",
        description: ".job-search-card__snippet, .job-description",
        postedAt: ".job-search-card__listdate, .job-card-container__listed-time"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'distribution'],
      retryAttempts: 3,
      timeout: 30000
    },

    // BrighterMonday - Enhanced with multiple URL patterns
    {
      url: "https://www.brightermonday.co.ke/jobs/search?q=supply+chain+logistics+procurement&location=kenya",
      source: "BrighterMonday",
      selectors: {
        jobContainer: ".job-item, .job-card, .search-result-item, article, .job-listing, .vacancy-item",
        title: "h2 a, h3 a, .job-title a, .title a, .job-listing-title",
        company: ".company a, .employer, .company-name, .client-name",
        location: ".location, .job-location, .area, .job-listing-location",
        jobLink: "h2 a, h3 a, .job-title a, .title a",
        description: ".job-snippet, .job-description, .excerpt",
        jobType: ".job-type, .employment-type",
        deadline: ".deadline, .expiry-date, .closing-date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'distribution'],
      retryAttempts: 3,
      timeout: 30000
    },

    // MyJobMag - Multiple search approaches
    {
      url: "https://www.myjobmag.co.ke/search/jobs?q=supply+chain+logistics&location=kenya",
      source: "MyJobMag",
      selectors: {
        jobContainer: ".job-card, .job-item, .listing-item, article, .job-listing",
        title: "h2 a, h3 a, .job-title a, .title a, .listing-title",
        company: ".company a, .employer, .company-name, .organization",
        location: ".location, .job-location, .area, .address",
        jobLink: "h2 a, h3 a, .job-title a, .title a",
        description: ".job-snippet, .description, .excerpt",
        postedAt: ".posted-date, .date-posted"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'operations'],
      retryAttempts: 3,
      timeout: 30000
    },

    // Fuzu - Enhanced selectors
    {
      url: "https://www.fuzu.com/kenya/jobs?search=supply+chain+logistics+procurement",
      source: "Fuzu",
      selectors: {
        jobContainer: ".job-card, .job-item, .listing, article, .opportunity-card",
        title: "h2 a, h3 a, .job-title a, .title a, .opportunity-title",
        company: ".company a, .employer, .company-name, .organization-name",
        location: ".location, .job-location, .area, .place",
        jobLink: "h2 a, h3 a, .job-title a, .title a",
        description: ".job-snippet, .description, .summary",
        jobType: ".job-type, .employment-type"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'transport'],
      retryAttempts: 3,
      timeout: 30000
    },

    // JobsInKenya - Enhanced
    {
      url: "https://www.jobsinkenya.co.ke/search?q=logistics+supply+chain+procurement",
      source: "JobsInKenya",
      selectors: {
        jobContainer: ".job-listing, .job-card, .vacancy-item, article, .job-item",
        title: "h2 a, h3 a, .job-title a, .title a, .vacancy-title",
        company: ".company-name, .employer, .client-name, .organization",
        location: ".location, .job-location, .area, .venue",
        jobLink: "h2 a, h3 a, .job-title a, .title a",
        description: ".job-snippet, .description, .duties"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 3,
      timeout: 30000
    },

    // CorporateJobsKenya - New source
    {
      url: "https://www.corporatejobskenya.com/search?q=supply+chain+logistics",
      source: "CorporateJobsKenya",
      selectors: {
        jobContainer: ".job-item, .job-card, .vacancy, article",
        title: "h2 a, h3 a, .job-title a, .title a",
        company: ".company, .employer, .organization",
        location: ".location, .area, .venue",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'operations'],
      retryAttempts: 2,
      timeout: 25000
    },

    // KenyaJobLink - New source
    {
      url: "https://www.kenyajoblink.com/search?category=logistics&keywords=supply+chain",
      source: "KenyaJobLink",
      selectors: {
        jobContainer: ".job-listing, .job-card, .vacancy-item",
        title: "h2 a, h3 a, .job-title a",
        company: ".company-name, .employer",
        location: ".location, .area",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement'],
      retryAttempts: 2,
      timeout: 25000
    },

    // JobConnect Kenya - New source
    {
      url: "https://jobconnectkenya.com/search?q=supply+chain+logistics+procurement",
      source: "JobConnect Kenya",
      selectors: {
        jobContainer: ".job-card, .job-item, .listing",
        title: "h2 a, h3 a, .job-title a",
        company: ".company, .employer",
        location: ".location, .area",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement'],
      retryAttempts: 2,
      timeout: 25000
    },

    // PigeonholeJobs - New source
    {
      url: "https://www.pigeonholejobs.com/search?q=logistics+supply+chain&location=kenya",
      source: "PigeonholeJobs",
      selectors: {
        jobContainer: ".job-item, .job-card, .listing",
        title: "h2 a, h3 a, .job-title a",
        company: ".company, .employer",
        location: ".location, .area",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement'],
      retryAttempts: 2,
      timeout: 25000
    },

    // RSS Feed from Career Point Kenya
    {
      url: "https://www.careerpointkenya.co.ke/feed/?s=logistics",
      source: "Career Point Kenya",
      isXmlFeed: true,
      selectors: {
        jobContainer: "item",
        title: "title",
        company: "category",
        location: "description",
        jobLink: "link",
        description: "description",
        postedAt: "pubDate"
      },
      keywords: ['supply chain', 'logistics', 'procurement'],
      retryAttempts: 2,
      timeout: 25000
    },

    // Government Jobs Portal
    {
      url: "https://www.psckjobs.go.ke/search?category=logistics",
      source: "PSC Jobs Kenya",
      selectors: {
        jobContainer: ".job-item, .vacancy-item, .notice-item",
        title: "h2 a, h3 a, .job-title a, .notice-title a",
        company: ".ministry, .department, .agency",
        location: ".location, .venue, .station",
        jobLink: "h2 a, h3 a, .job-title a, .notice-title a",
        deadline: ".deadline, .closing-date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'stores'],
      retryAttempts: 2,
      timeout: 30000
    }
  ];
};
