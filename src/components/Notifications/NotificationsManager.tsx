import { useNotifications } from '@/hooks/useNotifications';
import { NotificationsIndicator } from './NotificationsIndicator';
import { NotificationDrawer } from './NotificationDrawer';

export const NotificationsManager = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    clearAll,
    handleConnectionAction
  } = useNotifications();

  const handleNotificationAction = async (notification: any, action: string) => {
    if (action === 'dismiss') {
      await markAsRead(notification.id);
    } else if (action === 'accept' || action === 'reject') {
      if (notification.type === 'connection_request') {
        await handleConnectionAction(notification.data.connection_id, action);
        await markAsRead(notification.id);
      }
    }
  };

  return (
    <NotificationDrawer
      notifications={notifications}
      trigger={
        <NotificationsIndicator
          count={unreadCount}
          onClick={() => {}} // Handled by Sheet trigger
        />
      }
      onMarkAsRead={markAsRead}
      onClear={clearAll}
      isLoading={isLoading}
    />
  );
};
