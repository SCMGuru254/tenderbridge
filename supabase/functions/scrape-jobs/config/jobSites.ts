
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // LinkedIn Jobs - Using guest jobs API endpoint (JSON response)
    {
      url: "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=supply%20chain%20logistics%20procurement&location=Kenya&start=0&f_TPR=r604800",
      source: "LinkedIn",
      selectors: {
        jobContainer: ".base-card, .job-search-card, .base-search-card, li",
        title: ".base-search-card__title, .base-card__full-link, h3.base-search-card__title a, h4 a",
        company: ".base-search-card__subtitle a, .base-search-card__subtitle, h4.base-search-card__subtitle a",
        location: ".job-search-card__location, .base-search-card__metadata span",
        jobLink: ".base-card__full-link, a.base-search-card__full-link, .base-search-card__title a, a[href*='linkedin.com/jobs']",
        description: ".base-search-card__subtitle, .job-search-card__snippet",
        postedAt: "time.job-search-card__listdate, time[datetime]"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'distribution', 'store', 'purchasing', 'operations'],
      retryAttempts: 3,
      timeout: 45000
    },

    // LinkedIn Jobs - Alternative: search with different keywords
    {
      url: "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=warehouse%20operations%20inventory&location=Kenya&start=0",
      source: "LinkedIn Warehouse",
      selectors: {
        jobContainer: ".base-card, .job-search-card, .base-search-card, li",
        title: ".base-search-card__title, h3.base-search-card__title a, h4 a",
        company: ".base-search-card__subtitle a, .base-search-card__subtitle",
        location: ".job-search-card__location, .base-search-card__metadata span",
        jobLink: ".base-card__full-link, a.base-search-card__full-link, a[href*='linkedin.com/jobs']",
        description: ".base-search-card__subtitle",
        postedAt: "time.job-search-card__listdate, time[datetime]"
      },
      keywords: ['warehouse', 'operations', 'inventory', 'store', 'stock'],
      retryAttempts: 3,
      timeout: 45000
    },

    // BrighterMonday - Updated URL and selectors
    {
      url: "https://www.brightermonday.co.ke/jobs?q=supply+chain+logistics",
      source: "BrighterMonday",
      selectors: {
        jobContainer: "article, .job-result-card, .mx-5, .relative.flex, [data-testid='job-card'], .job-card, div[class*='job']",
        title: "h3 a, h2 a, .job-title a, a[data-testid='job-title'], .title a, [class*='title'] a",
        company: ".company-name, .text-sm a, span[class*='company'], [data-testid='company-name'], .employer",
        location: ".location, span[class*='location'], [data-testid='job-location'], .area, [class*='location']",
        jobLink: "h3 a, h2 a, .job-title a, a[href*='/jobs/']",
        description: ".job-snippet, .description, p[class*='description']",
        jobType: ".job-type, span[class*='type']",
        deadline: ".deadline, .closing-date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory'],
      retryAttempts: 3,
      timeout: 45000
    },

    // BrighterMonday - Alternative categories
    {
      url: "https://www.brightermonday.co.ke/jobs/logistics",
      source: "BrighterMonday Logistics",
      selectors: {
        jobContainer: "article, .job-result-card, .mx-5, .relative.flex, div[class*='job'], .job-card",
        title: "h3 a, h2 a, .job-title a, a[data-testid='job-title'], .title a",
        company: ".company-name, .text-sm a, span[class*='company'], .employer",
        location: ".location, span[class*='location'], .area",
        jobLink: "h3 a, h2 a, a[href*='/jobs/']",
        description: ".job-snippet, .description"
      },
      keywords: ['logistics', 'transport', 'fleet', 'distribution'],
      retryAttempts: 3,
      timeout: 45000
    },

    // MyJobMag Kenya - Updated
    {
      url: "https://www.myjobmag.co.ke/jobs?q=supply+chain+logistics",
      source: "MyJobMag",
      selectors: {
        jobContainer: ".job-card, .job-list-item, article, .job-list, .job-item, li.job",
        title: "h2 a, h3 a, .job-title a, .title a, a.job-name",
        company: ".company a, .company-name, .employer, span.company",
        location: ".location, .job-location, .area",
        jobLink: "h2 a, h3 a, .job-title a, a[href*='/job/']",
        description: ".job-snippet, .description, .excerpt",
        postedAt: ".posted-date, .date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'operations'],
      retryAttempts: 3,
      timeout: 45000
    },

    // Fuzu Kenya - Updated
    {
      url: "https://www.fuzu.com/kenya/jobs?search=supply+chain+logistics",
      source: "Fuzu",
      selectors: {
        jobContainer: ".job-card, article, .opportunity-card, div[class*='job'], .listing",
        title: "h2 a, h3 a, .job-title a, .opportunity-title a, a[class*='title']",
        company: ".company a, .employer, .company-name, .organization",
        location: ".location, .job-location, .place",
        jobLink: "h2 a, h3 a, a[href*='/job/'], a[href*='/opportunity/']",
        description: ".description, .summary",
        jobType: ".job-type, .type"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 3,
      timeout: 45000
    },

    // Career Point Kenya RSS
    {
      url: "https://www.careerpointkenya.co.ke/feed/?s=logistics+supply+chain",
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
      timeout: 30000
    },

    // Indeed Kenya via Google
    {
      url: "https://ke.indeed.com/jobs?q=supply+chain+logistics&l=Kenya",
      source: "Indeed Kenya",
      selectors: {
        jobContainer: ".job_seen_beacon, .jobsearch-SerpJobCard, .result, div[data-jk], .tapItem",
        title: "h2.jobTitle a span, .jobTitle span, h2 a span[title], a[data-jk] span",
        company: ".companyName, span.company, .css-92r8pb-companyName, [data-testid='company-name']",
        location: ".companyLocation, .css-1p0sjhy-companyLocation, [data-testid='text-location']",
        jobLink: "h2.jobTitle a, a[data-jk], .jobTitle a",
        description: ".job-snippet, .underShelfFooter",
        postedAt: ".date"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse'],
      retryAttempts: 3,
      timeout: 45000
    },

    // Glassdoor Kenya
    {
      url: "https://www.glassdoor.com/Job/kenya-supply-chain-jobs-SRCH_IL.0,5_IN126_KO6,18.htm",
      source: "Glassdoor",
      selectors: {
        jobContainer: "[data-test='jobListing'], .react-job-listing, article",
        title: "[data-test='job-title'], .job-title, h2 a",
        company: "[data-test='employer-name'], .employer-name",
        location: "[data-test='job-location'], .location",
        jobLink: "[data-test='job-title'], a[href*='/job-listing/']",
        description: ".jobDescriptionContent"
      },
      keywords: ['supply chain', 'logistics', 'procurement'],
      retryAttempts: 2,
      timeout: 45000
    },

    // JobsInKenya
    {
      url: "https://www.jobsinkenya.co.ke/search?q=logistics+supply+chain",
      source: "JobsInKenya",
      selectors: {
        jobContainer: ".job-listing, .job-card, article, .vacancy-item",
        title: "h2 a, h3 a, .job-title a, .vacancy-title a",
        company: ".company-name, .employer",
        location: ".location, .area",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement'],
      retryAttempts: 2,
      timeout: 30000
    },

    // Government Jobs
    {
      url: "https://www.psckjobs.go.ke/search?category=logistics",
      source: "PSC Jobs Kenya",
      selectors: {
        jobContainer: ".job-item, .vacancy-item, article",
        title: "h2 a, h3 a, .job-title a",
        company: ".ministry, .department",
        location: ".location, .station",
        jobLink: "h2 a, h3 a, .job-title a"
      },
      keywords: ['supply chain', 'logistics', 'procurement', 'stores'],
      retryAttempts: 2,
      timeout: 30000
    }
  ];
};
