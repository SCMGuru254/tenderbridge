import { useState } from 'react';
import { format } from 'date-fns';
import { UserPlus, UserCheck, Shield, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Notification, NotificationAction } from '@/types/notifications';

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
      case 'connection_request':
        return <UserPlus className="h-5 w-5" />;
      case 'connection_accepted':
        return <UserCheck className="h-5 w-5" />;
      case 'role_change':
        return <Shield className="h-5 w-5" />;
      case 'profile_view':
        return <Eye className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (notification.type) {
      case 'connection_request':
        return (
          <>
            <p className="text-sm">
              <span className="font-semibold">{notification.data.from_user_name}</span> wants to connect with you
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
        );

      case 'connection_accepted':
        return (
          <p className="text-sm">
            <span className="font-semibold">{notification.data.user_name}</span> accepted your connection request
          </p>
        );

      case 'role_change':
        return (
          <p className="text-sm">
            Your role has been {notification.data.action === 'INSERT' ? 'updated to' : 'removed from'} {notification.data.role}
          </p>
        );

      case 'profile_view':
        return (
          <p className="text-sm">
            <span className="font-semibold">{notification.data.viewer_name}</span> viewed your profile
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`p-4 ${!notification.read ? 'bg-primary/5' : ''}`}>
      <div className="flex gap-3">
        <div className="mt-1">{renderIcon()}</div>
        <div className="flex-1">
          {renderContent()}
          <p className="text-xs text-muted-foreground mt-2">
            {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        {!notification.read && (
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
