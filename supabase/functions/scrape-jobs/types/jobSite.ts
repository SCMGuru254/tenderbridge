
export interface JobSite {
  url: string;
  source: string;
  selectors: {
    jobContainer: string;
    title: string;
    company: string;
    location: string;
    jobLink: string;
    jobType?: string | null;
    deadline?: string | null;
    salary?: string | null;
    experience?: string | null;
    skills?: string | null;
    employmentType?: string | null;
    remote?: string | null;
    companyWebsite?: string | null;
    companyDescription?: string | null;
    description?: string | null;
  };
  keywords?: string[];
  isXmlFeed?: boolean;
  useDirectXmlParser?: boolean;
  feedType?: 'rss' | 'job' | 'custom';
  retryAttempts?: number;
  timeout?: number;
  rateLimit?: {
    requestsPerMinute: number;
    delayBetweenRequests: number;
  };
}
