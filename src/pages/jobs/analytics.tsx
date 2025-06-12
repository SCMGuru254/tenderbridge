import React from 'react';
import { JobAnalytics } from '@/components/Jobs/JobAnalytics';
import { useRouter } from 'next/router';

export default function JobAnalyticsPage() {
  const router = useRouter();
  const { jobId } = router.query;

  if (!jobId || typeof jobId !== 'string') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Job Analytics</h1>
          <p className="mt-2 text-gray-500">Please select a job to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Job Analytics</h1>
        <p className="mt-2 text-gray-500">
          Track performance metrics and engagement for your job posting.
        </p>
      </div>
      <JobAnalytics jobId={jobId} />
    </div>
  );
} 