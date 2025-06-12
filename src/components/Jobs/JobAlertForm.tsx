import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { jobService, type JobFilters } from '@/services/jobService';
import { notificationService } from '@/services/notificationService';

interface JobAlertFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const JobAlertForm: React.FC<JobAlertFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<JobFilters>({
    category: '',
    location: '',
    jobType: '',
    salaryRange: '',
    experienceLevel: '',
    skills: [],
    isRemote: false
  });

  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'instant'>('daily');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const alert = await jobService.createJobAlert(user.id, {
        searchParams: filters,
        frequency,
        isActive: true
      });

      if (alert) {
        // Create initial notification
        await notificationService.createNotification({
          userId: user.id,
          type: 'job_alert',
          title: 'Job Alert Created',
          message: 'Your job alert has been created successfully.',
          data: {
            alertId: alert.id,
            filters
          },
          isRead: false
        });

        onSuccess?.();
      }
    } catch (err) {
      setError('Failed to create job alert. Please try again.');
      console.error('Error creating job alert:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Job Category
        </label>
        <input
          type="text"
          id="category"
          value={filters.category}
          onChange={e => handleFilterChange('category', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Software Engineer"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          value={filters.location}
          onChange={e => handleFilterChange('location', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., New York"
        />
      </div>

      <div>
        <label
          htmlFor="jobType"
          className="block text-sm font-medium text-gray-700"
        >
          Job Type
        </label>
        <select
          id="jobType"
          value={filters.jobType}
          onChange={e => handleFilterChange('jobType', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Any</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="experienceLevel"
          className="block text-sm font-medium text-gray-700"
        >
          Experience Level
        </label>
        <select
          id="experienceLevel"
          value={filters.experienceLevel}
          onChange={e => handleFilterChange('experienceLevel', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Any</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="lead">Lead</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRemote"
          checked={filters.isRemote}
          onChange={e => handleFilterChange('isRemote', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="isRemote"
          className="ml-2 block text-sm text-gray-700"
        >
          Remote Only
        </label>
      </div>

      <div>
        <label
          htmlFor="frequency"
          className="block text-sm font-medium text-gray-700"
        >
          Alert Frequency
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={e => setFrequency(e.target.value as 'daily' | 'weekly' | 'instant')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="instant">Instant</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Alert'}
        </button>
      </div>
    </form>
  );
}; 