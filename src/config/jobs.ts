export const JOB_CONFIG = {
  CACHE_DURATION_HOURS: 24,
  RETENTION_DAYS: 30,
  MAX_REQUESTS_PER_HOUR: 100,
  SEARCH_QUERIES: [
    // Supply Chain specific
    'supply chain jobs kenya',
    'logistics jobs kenya',
    'procurement jobs kenya',
    'warehouse jobs kenya',
    // Popular Kenyan job sites
    'site:fuzu.com supply chain kenya',
    'site:brightermonday.co.ke supply chain',
    'site:jobwebkenya.com supply chain',
    'site:myjobmag.co.ke supply chain',
    'site:ihub.co.ke supply chain',
    'site:kenyajob.com supply chain logistics',
    // Company specific
    'site:careers.ke supply chain',
    'site:corporate.jobsinkenya.co.ke logistics',
    // Government and NGO
    'site:psckjobs.go.ke logistics procurement',
    'site:unon.unon.org/content/jobs supply chain kenya'
  ],
  LOCATION_KEYWORDS: [
    'Nairobi', 'Mombasa', 'Kisumu', 'Kenya',
    'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Remote Kenya', 'East Africa'
  ],
  DEFAULT_LOCATION: 'Kenya',
  // Direct scraping URLs (no API needed)
  DIRECT_SOURCES: [
    {
      name: 'BrighterMonday',
      url: 'https://www.brightermonday.co.ke/jobs/supply-chain-management',
      selector: '.search-result'
    },
    {
      name: 'MyJobMag',
      url: 'https://www.myjobmag.co.ke/jobs-by-field/supply-chain',
      selector: '.job-list'
    },
    {
      name: 'Fuzu',
      url: 'https://www.fuzu.com/kenya/jobs?query=supply%20chain',
      selector: '.job-card'
    }
  ]
} as const;

export type JobConfig = typeof JOB_CONFIG; 