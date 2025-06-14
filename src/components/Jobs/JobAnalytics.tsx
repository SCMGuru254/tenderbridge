
import React, { useEffect, useState } from 'react';
import { jobService, type JobAnalytics } from '@/services/jobService';
import {
  BarChart3,
  Users,
  FileText,
  Bookmark,
  Share,
  Clock
} from 'lucide-react';

interface JobAnalyticsProps {
  jobId: string;
}

export const JobAnalytics: React.FC<JobAnalyticsProps> = ({ jobId }) => {
  const [analytics, setAnalytics] = useState<JobAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadAnalytics = React.useCallback(async () => {
    if (!jobId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await jobService.getJobAnalytics(jobId);
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load job analytics');
      console.error('Error loading job analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No analytics data available</p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Views',
      value: analytics.views,
      icon: BarChart3,
      color: 'text-blue-500'
    },
    {
      name: 'Unique Viewers',
      value: analytics.uniqueVisitors,
      icon: Users,
      color: 'text-green-500'
    },
    {
      name: 'Applications',
      value: analytics.applications,
      icon: FileText,
      color: 'text-purple-500'
    },
    {
      name: 'Saved',
      value: analytics.saves,
      icon: Bookmark,
      color: 'text-yellow-500'
    },
    {
      name: 'Shares',
      value: analytics.shares,
      icon: Share,
      color: 'text-red-500'
    },
    {
      name: 'Avg. Time Spent',
      value: `${Math.round(analytics.averageTimeSpent / 60)}m`,
      icon: Clock,
      color: 'text-gray-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Job Analytics</h3>
      </div>
      <div className="p-4">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(item => (
            <div
              key={item.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${item.color} bg-opacity-10`}>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
