// ...existing code...
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NotificationsIndicatorProps {
  count: number;
  onClick: () => void;
}

export const NotificationsIndicator = ({ count, onClick }: NotificationsIndicatorProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative"
      onClick={onClick}
      aria-label={`${count} unread notifications`}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Button>
  );
};
