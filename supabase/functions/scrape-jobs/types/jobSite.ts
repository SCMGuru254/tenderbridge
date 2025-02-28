
export interface JobSite {
  url: string;
  selectors: {
    jobContainer: string;
    title: string;
    company: string;
    location: string;
    type: string | null;
    url: string;
  };
  source: string;
}
