
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  jobApplications: number;
  conversionRate: number;
}

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setData({
        totalViews: 15420,
        uniqueVisitors: 8932,
        jobApplications: 245,
        conversionRate: 2.74
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Views</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data?.totalViews.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Unique Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data?.uniqueVisitors.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Job Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data?.jobApplications}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data?.conversionRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
};
