
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { NotificationList } from './NotificationList';
import { useAuth } from '@/hooks/useAuth';
import { notificationService, type Notification } from '@/services/notificationService';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      // Set up real-time subscription for notifications
      const subscription = notificationService.subscribeToNotifications(
        user.id,
        (notifications: Notification[]) => {
          setUnreadCount(notifications.filter((n: Notification) => !n.isRead).length);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const notifications = await notificationService.getNotifications(user!.id);
      setUnreadCount(notifications.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setIsOpen(false);
    // Handle notification click (e.g., navigate to job details)
    if (notification.data?.jobId) {
      // Navigate to job details
      window.location.href = `/jobs/${notification.data.jobId}`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <NotificationList
            maxNotifications={5}
            onNotificationClick={handleNotificationClick}
          />
        </div>
      )}
    </div>
  );
}; 
