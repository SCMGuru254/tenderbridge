
export interface JobSite {
  url: string;
  source: string;
  selectors: {
    jobContainer: string;
    title: string;
    company: string;
    location: string;
    jobLink: string;
    jobType: string | null;
    deadline: string | null;
  };
  keywords?: string[];
  isXmlFeed?: boolean;
  useDirectXmlParser?: boolean; // Flag to use our custom XML parser
  feedType?: 'rss' | 'job' | 'custom'; // Different XML feed formats
}
