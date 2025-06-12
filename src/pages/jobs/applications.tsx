import React from 'react';
import { JobApplicationsList } from '@/components/Jobs/JobApplicationsList';

export default function JobApplicationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Job Applications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your job applications
          </p>
        </div>
      </div>

      <div className="mt-8">
        <JobApplicationsList />
      </div>
    </div>
  );
} 