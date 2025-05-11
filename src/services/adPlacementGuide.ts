
/**
 * Ad Placement Guide
 * 
 * This document outlines the recommended ad placements for each page in the application.
 * Use this as a reference when integrating ads into the UI.
 */

// Ad types available in the system
export type AdType = "banner" | "sidebar" | "inline" | "interstitial";

// Ad positions available in the system
export type AdPosition = "header" | "sidebar-top" | "sidebar-bottom" | "content" | "fullscreen";

// Interface for page-specific ad configuration
interface PageAdConfig {
  recommended: Array<{
    type: AdType;
    position: AdPosition;
    priority: "high" | "medium" | "low";
    description: string;
  }>;
}

// Ad configuration for each page
export const pageAdConfigurations: Record<string, PageAdConfig> = {
  // Home page
  "home": {
    recommended: [
      {
        type: "banner",
        position: "header",
        priority: "high",
        description: "Top banner ad visible to all users"
      },
      {
        type: "sidebar",
        position: "sidebar-top",
        priority: "medium",
        description: "Top sidebar ad for desktop users"
      },
      {
        type: "sidebar",
        position: "sidebar-bottom",
        priority: "low",
        description: "Bottom sidebar ad for desktop users"
      }
    ]
  },
  
  // Jobs listing page
  "jobs": {
    recommended: [
      {
        type: "sidebar",
        position: "sidebar-top",
        priority: "high",
        description: "High visibility sidebar ad for job seekers"
      },
      {
        type: "inline",
        position: "content",
        priority: "medium",
        description: "Inline ad between job listings"
      }
    ]
  },
  
  // Job details page
  "job-details": {
    recommended: [
      {
        type: "sidebar",
        position: "sidebar-bottom",
        priority: "high",
        description: "Sidebar ad complementing job application"
      },
      {
        type: "inline",
        position: "content",
        priority: "medium",
        description: "Inline ad below job description"
      }
    ]
  },
  
  // Blog page
  "blog": {
    recommended: [
      {
        type: "banner",
        position: "header",
        priority: "medium",
        description: "Banner ad above blog content"
      },
      {
        type: "sidebar",
        position: "sidebar-top",
        priority: "high",
        description: "High visibility sidebar ad for blog readers"
      },
      {
        type: "inline",
        position: "content",
        priority: "medium",
        description: "Inline ad between blog posts"
      }
    ]
  },
  
  // Profile page
  "profile": {
    recommended: [
      {
        type: "sidebar",
        position: "sidebar-bottom",
        priority: "medium",
        description: "Unobtrusive sidebar ad for profile viewers"
      }
    ]
  },
  
  // Discussion page
  "discussions": {
    recommended: [
      {
        type: "sidebar",
        position: "sidebar-top",
        priority: "medium",
        description: "Sidebar ad for discussion participants"
      },
      {
        type: "inline",
        position: "content",
        priority: "low",
        description: "Low-priority inline ad between discussions"
      }
    ]
  },
  
  // Document generator page
  "document-generator": {
    recommended: [
      {
        type: "sidebar",
        position: "sidebar-bottom",
        priority: "medium",
        description: "Sidebar ad for document generator users"
      }
    ]
  },
  
  // Interview prep page
  "interview-prep": {
    recommended: [
      {
        type: "sidebar",
        position: "sidebar-top",
        priority: "high",
        description: "Highly relevant sidebar ad for interview prep"
      },
      {
        type: "inline",
        position: "content",
        priority: "medium",
        description: "Inline ad between interview resources"
      }
    ]
  },
  
  // Free services page
  "free-services": {
    recommended: [
      {
        type: "banner",
        position: "header",
        priority: "medium",
        description: "Banner ad above free services"
      },
      {
        type: "sidebar",
        position: "sidebar-bottom",
        priority: "low",
        description: "Low-priority sidebar ad"
      }
    ]
  },
  
  // Rewards page
  "rewards": {
    recommended: [
      {
        type: "inline",
        position: "content",
        priority: "medium",
        description: "Example ad to demonstrate points earning"
      }
    ]
  }
};

// Helper function to get recommended ad placements for a page
export function getRecommendedAdsForPage(pageName: string): Array<{
  type: AdType;
  position: AdPosition;
  priority: "high" | "medium" | "low";
  description: string;
}> {
  return pageAdConfigurations[pageName]?.recommended || [];
}

// Best practices for ad implementation
export const adBestPractices = {
  frequency: "Limit to 1 ad per 5 screens of content",
  spacing: "Maintain at least 300px between ads",
  performance: "Ensure ads are lazy-loaded to maintain page performance",
  mobile: "Use responsive ad units that adapt to screen size",
  userExperience: "Avoid intrusive ad placements that interrupt core functionality"
};
