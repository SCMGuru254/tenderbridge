
import { useState, useEffect } from 'react';
import { useEngagement } from '@/hooks/useEngagement';
import { useAuth } from '@/hooks/useAuth';

interface UserActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export const ActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);

  useEffect(() => {
    if (user) {
      // Mock activities data
      setActivities([
        {
          id: '1',
          type: 'job_application',
          description: 'Applied to Software Engineer position',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Activity Feed</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {activities.map(activity => (
          <li key={activity.id} className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span className="text-gray-400">{activity.type}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <div className="text-xs text-gray-500">
                  {activity.timestamp}
                </div>
                {activity.metadata && (
                  <div className="text-xs text-gray-400">
                    Additional data available
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
