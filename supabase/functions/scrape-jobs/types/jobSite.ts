
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
}
