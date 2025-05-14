
import { JobSite } from "../types/jobSite.ts";

export const getJobSites = (): JobSite[] => {
  return [
    // Google Search for Supply Chain jobs posted in the last 24 hours with expanded keywords
    {
      url: "https://www.google.com/search?q=site:linkedin.com+OR+site:brightermonday.co.ke+OR+site:fuzu.com+OR+site:jobwebkenya.com+OR+site:myjobmag.co.ke+(supply+chain+OR+logistics+OR+procurement+OR+warehouse+OR+inventory+OR+distribution+OR+shipping+OR+freight+OR+import+OR+export)+jobs+kenya&tbs=qdr:d",
      source: "Google Search 24h",
      selectors: {
        jobContainer: ".g, .jtfYYd, [data-hveid], .jobList-item, .job-card, [role='article'], .PwjeAc, .BjJfJf, .vWdgBe, .KLsYvd, .MjjYud",
        title: "h3, .DKV0Md, .JobTitle, .title, [role='heading'], .BjJfJf, .pE8vnd, .tl-title, .LC20lb",
        company: ".MBeuO, .company, .employer, [class*='company'], [class*='subtitle'], .vNEEBe, .tl-company, .VuuXrf",
        location: ".MBeuO, .location, [class*='location'], [class*='subtitle'], .Qk80Jf, .tl-location, .VuuXrf",
        jobLink: "a[href], .pMhGee a, .tl-link, .yuRUbf a",
        jobType: ".SuWscb, .tl-job-type",
        deadline: ".SuWscb, .tl-deadline",
      },
      keywords: [
        'supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'shipping',
        'distribution', 'freight', 'import', 'export', 'supply planner', 'demand planner',
        'logistics coordinator', 'procurement officer', 'supply chain manager', 'logistics manager',
        'procurement manager', 'warehouse manager', 'inventory manager', 'distribution manager',
        'scm', 'sourcing', 'purchasing', 'materials', 'operations', 'transport', 'customs'
      ]
    },
    // MyJobMag Supply Chain Jobs XML Feed - Direct integration with more specific keywords
    {
      url: "https://www.myjobmag.co.ke/jobsxml_by_categories.xml",
      source: "MyJobMag XML Feed",
      selectors: {
        jobContainer: "job",
        title: "title",
        company: "company",
        location: "location",
        jobLink: "link",
        jobType: "job_type",
        deadline: "deadline",
      },
      isXmlFeed: true,
      useDirectXmlParser: true,
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'shipping']
    },
    // LinkedIn Supply Chain jobs in Kenya
    {
      url: "https://www.linkedin.com/jobs/search/?keywords=supply%20chain%20logistics%20procurement&location=Kenya",
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
    // MyJobMag Supply Chain jobs in Kenya - more specific URL
    {
      url: "https://www.myjobmag.co.ke/jobs-by-field/supply-chain",
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
    // JobWebKenya Supply Chain jobs - XML Feed with keywords
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
      isXmlFeed: true,
      keywords: ['supply chain', 'logistics', 'procurement', 'warehouse']
    },
    // PigiaMe Jobs with logistics focus
    {
      url: "https://www.pigiame.co.ke/jobs?q=logistics+supply+chain",
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
    // MyJobMag Widget - with specific supply chain keywords
    {
      url: "https://www.myjobmag.co.ke/widget/feed.php?field=63,65&industry=0&keyword=supply%20chain%20logistics%20procurement%20warehouse&count=45",
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
