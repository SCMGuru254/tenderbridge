import React from 'react';
import { useEngagement } from '../../hooks/useEngagement';
import { UserActivity } from '../../types/engagement';
import { Card, ScrollArea } from '@/components/ui';

export const ActivityFeed = () => {
  const { activities } = useEngagement();

  return (
    <Card className="w-full max-w-2xl p-4">
      <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
      <ScrollArea className="h-[600px]">
        {activities.map((activity: UserActivity) => (
          <div key={activity.id} className="mb-4 p-3 border-b last:border-b-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                {activity.type.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                  {activity.metadata && (
                    <span className="text-sm text-gray-600">
                      • {activity.metadata}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
};
