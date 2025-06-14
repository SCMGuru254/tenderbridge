
import { useState } from 'react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export const useAnalytics = () => {
  const [isLoading] = useState(false);
  const [analyticsData] = useState<AnalyticsData>({
    pageViews: 12543,
    uniqueVisitors: 8921,
    bounceRate: 32.5,
    avgSessionDuration: 245
  });
  
  const [trafficSources] = useState<TrafficSource[]>([
    { source: 'Direct', visitors: 3245, percentage: 36.4 },
    { source: 'Google', visitors: 2876, percentage: 32.2 },
    { source: 'Social Media', visitors: 1654, percentage: 18.5 },
    { source: 'Referrals', visitors: 1146, percentage: 12.9 }
  ]);

  const trackEvent = (event: string, properties?: Record<string, any>) => {
    console.log('Tracking event:', event, properties);
  };

  const trackPageView = (page: string) => {
    console.log('Tracking page view:', page);
  };

  return {
    analyticsData,
    trafficSources,
    isLoading,
    trackEvent,
    trackPageView
  };
};
