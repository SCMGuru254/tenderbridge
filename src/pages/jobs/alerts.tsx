import React, { useState } from 'react';
import { JobAlertForm } from '@/components/Jobs/JobAlertForm';
import { JobAlertsList } from '@/components/Jobs/JobAlertsList';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function JobAlertsPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Job Alerts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Get notified when new jobs match your criteria
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Create Alert
          </button>
        </div>
      </div>

      <div className="mt-8">
        {isCreating ? (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create New Job Alert
              </h3>
              <div className="mt-5">
                <JobAlertForm
                  onSuccess={() => setIsCreating(false)}
                  onCancel={() => setIsCreating(false)}
                />
              </div>
            </div>
          </div>
        ) : (
          <JobAlertsList />
        )}
      </div>
    </div>
  );
} 