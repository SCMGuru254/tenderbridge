
export const JOB_CONFIG = {
  CACHE_DURATION_HOURS: 24,
  RETENTION_DAYS: 30,
  MAX_REQUESTS_PER_HOUR: 100,
  SEARCH_QUERIES: [
    // Supply Chain specific - more targeted queries
    'supply chain manager jobs kenya',
    'logistics coordinator jobs kenya',
    'procurement officer jobs kenya',
    'warehouse supervisor jobs kenya',
    'inventory controller jobs kenya',
    'supply chain analyst kenya',
    'logistics manager kenya',
    // Popular Kenyan job sites with specific supply chain focus
    'site:fuzu.com "supply chain" "logistics" kenya',
    'site:brightermonday.co.ke "supply chain" "logistics"',
    'site:jobwebkenya.com "supply chain" "logistics"',
    'site:myjobmag.co.ke "supply chain" "logistics"',
    'site:ihub.co.ke "supply chain" "logistics"',
    'site:kenyajob.com "supply chain" "logistics"',
    // Company specific - targeting companies known for supply chain jobs
    'site:careers.ke "supply chain" "logistics"',
    'site:corporate.jobsinkenya.co.ke "logistics" "procurement"',
    // Government and NGO
    'site:psckjobs.go.ke "logistics" "procurement"',
    'site:unon.unon.org/content/jobs "supply chain" kenya'
  ],
  LOCATION_KEYWORDS: [
    'Nairobi', 'Mombasa', 'Kisumu', 'Kenya',
    'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Remote Kenya', 'East Africa'
  ],
  DEFAULT_LOCATION: 'Kenya',
  // Direct scraping URLs with more specific query parameters
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
      url: 'https://www.fuzu.com/kenya/jobs?query=supply%20chain%20logistics',
      selector: '.job-card'
    }
  ],
  // Define specific supply chain keywords for better filtering
  SUPPLY_CHAIN_KEYWORDS: [
    'supply chain', 'logistics', 'procurement', 'warehouse', 'inventory',
    'shipping', 'distribution', 'operations', 'sourcing', 'purchasing',
    'scm', 'freight', 'transport', 'fleet', 'planning', 'demand',
    'forecasting', 'material', 'import', 'export', 'customs', 'supply',
    'procurement', 'sourcing', 'inventory control', 'demand planning'
  ]
} as const;

export type JobConfig = typeof JOB_CONFIG;
