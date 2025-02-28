
import { JobSite } from "../types/jobSite.ts";

export function getJobSites(): JobSite[] {
  return [
    {
      url: 'https://www.brightermonday.co.ke/jobs/supply-chain-logistics',
      selectors: {
        jobContainer: '.search-result',
        title: 'h3',
        company: '.search-result__job-meta span.text-grey',
        location: '.search-result__location',
        type: '.search-result__job-meta span:last-child',
        url: 'h3 a'
      },
      source: 'BrighterMonday'
    },
    {
      url: 'https://www.fuzu.com/kenya/jobs/supply-chain',
      selectors: {
        jobContainer: '.JobItem',
        title: '.JobItem__title',
        company: '.JobItem__meta strong',
        location: '.JobItemFooter__location',
        type: '.JobItemFooter__type',
        url: 'a.JobItem'
      },
      source: 'Fuzu'
    },
    {
      url: 'https://ke.indeed.com/jobs?q=supply+chain&l=Nairobi%2C+Nairobi+County',
      selectors: {
        jobContainer: '.job_seen_beacon',
        title: '.jobTitle span',
        company: '.companyName',
        location: '.companyLocation',
        type: '.metadata-snippet',
        url: '.jobTitle a'
      },
      source: 'Indeed'
    },
    {
      url: 'https://www.linkedin.com/jobs/search/?keywords=supply%20chain&location=Kenya',
      selectors: {
        jobContainer: '.base-card',
        title: '.base-search-card__title',
        company: '.base-search-card__subtitle',
        location: '.job-search-card__location',
        type: null,
        url: '.base-card__full-link'
      },
      source: 'LinkedIn'
    },
    {
      url: 'https://www.myjobmag.co.ke/jobs-by-field/supply-chain-management',
      selectors: {
        jobContainer: '.jobs-wrap',
        title: '.job-title a',
        company: '.company-title a',
        location: '.job-location',
        type: '.job-salary-range',
        url: '.job-title a'
      },
      source: 'MyJobMag'
    },
    {
      url: 'https://www.bestjobs.co.ke/jobs-supply+chain',
      selectors: {
        jobContainer: '.job-card',
        title: '.job-title',
        company: '.company-name',
        location: '.location',
        type: '.job-type',
        url: 'a.job-link'
      },
      source: 'BestJobs'
    },
    {
      url: 'https://jobwebkenya.com/job-category/procurement-supply-chain/',
      selectors: {
        jobContainer: '.raven-post',
        title: '.raven-post-title',
        company: '.raven-post-meta-item:first-child',
        location: '.raven-post-meta-item:nth-child(2)',
        type: '.raven-post-meta-item:nth-child(3)',
        url: '.raven-post-title a'
      },
      source: 'JobWebKenya'
    }
  ];
}
