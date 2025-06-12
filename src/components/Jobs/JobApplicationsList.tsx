import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { jobService, type JobApplication } from '@/services/jobService';
import { formatDistanceToNow } from 'date-fns';
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export const JobApplicationsList: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobService.getJobApplications(user!.id);
      setApplications(data);
    } catch (err) {
      setError('Failed to load job applications');
      console.error('Error loading job applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (
    applicationId: string,
    status: JobApplication['status']
  ) => {
    try {
      await jobService.updateJobApplication(applicationId, { status });
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'offered':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'accepted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'interviewing':
        return <CalendarIcon className="h-5 w-5" />;
      case 'offered':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5" />;
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
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

  if (applications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No job applications found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Your Job Applications</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {applications.map(application => (
          <div key={application.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-900">
                    {application.jobId}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusIcon(application.status)}
                    <span className="ml-1">
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </span>
                  </span>
                </div>
                {application.notes && (
                  <p className="mt-2 text-sm text-gray-500">
                    {application.notes}
                  </p>
                )}
                {application.nextSteps && (
                  <p className="mt-1 text-sm text-gray-500">
                    Next steps: {application.nextSteps}
                  </p>
                )}
                {application.interviewDate && (
                  <p className="mt-1 text-sm text-gray-500">
                    Interview: {new Date(application.interviewDate).toLocaleDateString()}
                  </p>
                )}
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>
                    Applied {formatDistanceToNow(new Date(application.appliedAt), {
                      addSuffix: true
                    })}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <select
                  value={application.status}
                  onChange={e =>
                    handleUpdateStatus(
                      application.id,
                      e.target.value as JobApplication['status']
                    )
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 