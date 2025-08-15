import { useState } from 'react';
import { format } from 'date-fns';
import { UserPlus, UserCheck, Shield, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notification, NotificationType } from '@/types/notifications';

type NotificationAction = 'accept' | 'reject' | 'dismiss';

interface NotificationItemProps {
  notification: Notification;
  onAction: (action: NotificationAction) => void;
}

export const NotificationItem = ({ notification, onAction }: NotificationItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: NotificationAction) => {
    setIsLoading(true);
    try {
      await onAction(action);
    } finally {
      setIsLoading(false);
    }
  };

  const renderIcon = () => {
    switch (notification.type) {
      case NotificationType.CONNECTION_REQUEST:
        return <UserPlus className="h-5 w-5" />;
      case NotificationType.CONNECTION_ACCEPTED:
        return <UserCheck className="h-5 w-5" />;
      case NotificationType.ROLE_CHANGE:
        return <Shield className="h-5 w-5" />;
      case NotificationType.PROFILE_VIEW:
        return <Eye className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (notification.type) {
      case NotificationType.CONNECTION_REQUEST:
        return notification.data ? (
          <>
            <p className="text-sm">
              <span className="font-semibold">{notification.data.userName}</span> wants to connect with you
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => handleAction('accept')}
                disabled={isLoading}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction('reject')}
                disabled={isLoading}
              >
                Reject
              </Button>
            </div>
          </>
        ) : null;

      case NotificationType.CONNECTION_ACCEPTED:
        return notification.data ? (
          <p className="text-sm">
            <span className="font-semibold">{notification.data.userName}</span> accepted your connection request
          </p>
        ) : null;

      case NotificationType.ROLE_CHANGE:
        return notification.data ? (
          <p className="text-sm">
            Your role has been updated from {notification.data.oldRole} to {notification.data.newRole}
          </p>
        ) : null;

      case NotificationType.PROFILE_VIEW:
        return notification.data ? (
          <p className="text-sm">
            <span className="font-semibold">{notification.data.userName}</span> viewed your profile
          </p>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Card className={`p-4 ${!notification.isRead ? 'bg-primary/5' : ''}`}>
      <div className="flex gap-3">
        <div className="mt-1">{renderIcon()}</div>
        <div className="flex-1">
          {renderContent()}
          <p className="text-xs text-muted-foreground mt-2">
            {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        {!notification.isRead && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAction('dismiss')}
            disabled={isLoading}
          >
            Dismiss
          </Button>
        )}
      </div>
    </Card>
  );
};
