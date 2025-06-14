import { useState, useEffect } from 'react';
import { useEngagement } from '@/hooks/useEngagement';
import { useAuth } from '@/hooks/useAuth';

interface UserNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const NotificationsPanel = () => {
  const { user } = useAuth();
  const engagement = useEngagement();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  useEffect(() => {
    if (user) {
      // Mock notifications data
      setNotifications([
        {
          id: '1',
          title: 'New Job Match',
          message: 'A new job matching your skills has been posted',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification.id} className="py-2 border-b last:border-b-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                </div>
                <span className="text-xs text-gray-400">{notification.createdAt}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
