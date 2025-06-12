import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { jobService, type JobAlert } from '@/services/jobService';
import { formatDistanceToNow } from 'date-fns';
import {
  BellIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const JobAlertsList: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobService.getJobAlerts(user!.id);
      setAlerts(data);
    } catch (err) {
      setError('Failed to load job alerts');
      console.error('Error loading job alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      await jobService.updateJobAlert(alertId, { isActive });
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, isActive } : alert
        )
      );
    } catch (err) {
      console.error('Error updating job alert:', err);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      await jobService.updateJobAlert(alertId, { isActive: false });
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Error deleting job alert:', err);
    }
  };

  const getFrequencyLabel = (frequency: JobAlert['frequency']) => {
    switch (frequency) {
      case 'instant':
        return 'Instant';
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      default:
        return frequency;
    }
  };

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

  if (alerts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No job alerts found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Your Job Alerts</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {alerts.map(alert => (
          <div key={alert.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <BellIcon className="h-5 w-5 text-blue-500" />
                  <h4 className="text-sm font-medium text-gray-900">
                    {alert.searchParams.category || 'Any Category'}
                  </h4>
                  {alert.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Location:{' '}
                    {alert.searchParams.location || 'Any Location'}
                  </p>
                  <p>
                    Job Type:{' '}
                    {alert.searchParams.jobType || 'Any Type'}
                  </p>
                  <p>
                    Experience:{' '}
                    {alert.searchParams.experienceLevel || 'Any Level'}
                  </p>
                  {alert.searchParams.isRemote && (
                    <p>Remote Only</p>
                  )}
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>
                    {alert.lastTriggered
                      ? `Last triggered ${formatDistanceToNow(
                          new Date(alert.lastTriggered),
                          { addSuffix: true }
                        )}`
                      : 'Not triggered yet'}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {getFrequencyLabel(alert.frequency)} updates
                  </span>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleToggleAlert(alert.id, !alert.isActive)
                  }
                  className="text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 