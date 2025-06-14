
import React, { useEffect, useState } from 'react';
import { jobService, type Job } from '@/services/jobService';
import { useAuth } from '@/hooks/useAuth';
import { BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';

interface JobRecommendationsProps {
  currentJobId?: string;
}

export const JobRecommendations: React.FC<JobRecommendationsProps> = ({
  currentJobId
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, currentJobId]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobService.getJobRecommendations(currentJobId);
      setRecommendations(data);
    } catch (err) {
      setError('Failed to load job recommendations');
      console.error('Error loading job recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) return;
    try {
      await jobService.saveJob(jobId, user.id);
      // Refresh recommendations to update saved status
      loadRecommendations();
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const handleShareJob = async (jobId: string) => {
    try {
      await jobService.shareJob(jobId);
      // Refresh recommendations to update share count
      loadRecommendations();
    } catch (err) {
      console.error('Error sharing job:', err);
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

  if (recommendations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No job recommendations available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Recommended Jobs</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recommendations.map(job => (
          <div key={job.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <a
                  href={`/jobs/${job.id}`}
                  className="text-lg font-medium text-gray-900 hover:text-blue-600"
                >
                  {job.title}
                </a>
                <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>{job.location}</span>
                  {job.is_remote && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Remote
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-2">
                <button
                  onClick={() => handleSaveJob(job.id)}
                  className="inline-flex items-center p-1.5 border border-gray-300 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-50"
                >
                  <BookmarkIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleShareJob(job.id)}
                  className="inline-flex items-center p-1.5 border border-gray-300 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-50"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
