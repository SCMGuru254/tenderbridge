import React, { useEffect } from 'react';
import { useEngagement } from '../../hooks/useEngagement';
import { UserNotification } from '../../types/engagement';
import { Badge, Button, ScrollArea } from '@/components/ui';

export const NotificationsPanel = () => {
  const { notifications, markAsRead, clearNotifications } = useEngagement();

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <Button variant="ghost" onClick={clearNotifications}>
          Clear All
        </Button>
      </div>
      <ScrollArea className="h-[400px]">
        {notifications.map((notification: UserNotification) => (
          <div
            key={notification.id}
            className={`p-3 mb-2 rounded-md ${
              notification.read ? 'bg-gray-50' : 'bg-blue-50'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              {!notification.read && (
                <Badge variant="default" className="mt-1">New</Badge>
              )}
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(notification.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
