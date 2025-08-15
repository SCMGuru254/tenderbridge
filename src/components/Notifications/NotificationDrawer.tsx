import { useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '@/types/notifications';

interface NotificationDrawerProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClear: () => void;
}

export const NotificationDrawer = ({
  notifications,
  onMarkAsRead,
  onClear,
}: NotificationDrawerProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={notifications.length === 0}
          >
            Clear all
          </Button>
        </SheetHeader>

        <div className="my-4">
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mb-2">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onAction={(action) => {
                    if (action === 'dismiss') {
                      onMarkAsRead(notification.id);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
