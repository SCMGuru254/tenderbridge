import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsChart } from './AnalyticsChart';
import { ABTestingPanel } from './ABTestingPanel';
import { Card } from '@/components/ui';
import { 
  AnalyticsSummary,
  SocialAnalytics,
  ABTest,
  PerformanceMetric
} from '../../types/analytics';

export const AnalyticsDashboard = () => {
  const {
    getAnalyticsSummary,
    getABTestResults,
    getSocialAnalytics,
    getPerformanceMetrics
  } = useAnalytics();

  const [summary, setSummary] = useState<AnalyticsSummary[]>([]);
  const [socialStats, setSocialStats] = useState<SocialAnalytics[]>([]);
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Get last 30 days of data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const summaryData = await getAnalyticsSummary(
        thirtyDaysAgo.toISOString(),
        new Date().toISOString()
      );
      setSummary(summaryData);

      const socialData = await getSocialAnalytics('all', [
        thirtyDaysAgo.toISOString(),
        new Date().toISOString()
      ]);
      setSocialStats(socialData);

      const testResults = await getABTestResults('all');
      setAbTests(testResults);

      const perfMetrics = await getPerformanceMetrics('page_load');
      setPerformance(perfMetrics);
    };

    fetchData();
  }, [getAnalyticsSummary, getSocialAnalytics, getABTestResults, getPerformanceMetrics]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Total Users</p>
              <p className="text-2xl font-bold">
                {summary.reduce((acc, curr) => acc + curr.unique_users, 0)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600">Total Interactions</p>
              <p className="text-2xl font-bold">
                {summary.reduce((acc, curr) => acc + curr.total_interactions, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Performance</h2>
          <div className="space-y-4">
            {performance.map(metric => (
              <div key={metric.id} className="flex justify-between items-center">
                <span className="text-gray-600">{metric.component || 'Overall'}</span>
                <span className="font-medium">{metric.value.toFixed(2)}ms</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AnalyticsChart
          data={summary}
          title="User Activity"
          type="line"
        />
        <AnalyticsChart
          data={socialStats}
          title="Social Engagement"
          type="bar"
        />
      </div>

      <div className="mb-8">
        <ABTestingPanel tests={abTests} />
      </div>
    </div>
  );
};
