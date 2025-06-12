import React from 'react';
import { JobRecommendations } from '@/components/Jobs/JobRecommendations';
import { useRouter } from 'next/router';

export default function JobRecommendationsPage() {
  const router = useRouter();
  const { jobId } = router.query;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Job Recommendations</h1>
        <p className="mt-2 text-gray-500">
          Discover jobs that match your skills and preferences.
        </p>
      </div>
      <JobRecommendations currentJobId={jobId as string} />
    </div>
  );
} 