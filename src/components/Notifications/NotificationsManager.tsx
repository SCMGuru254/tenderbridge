
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDrawer } from './NotificationDrawer';

export const NotificationsManager = () => {
  const {
    notifications,
    markAsRead,
    clearAll
  } = useNotifications();

  // handleNotificationAction is unused and removed to fix TS error

  return (
    <NotificationDrawer
      notifications={notifications}
      onMarkAsRead={markAsRead}
      onClear={clearAll}
    />
  );
};
