
import { Notification, NotificationType } from '@/types/notifications';

// Mock notifications - in a real app, this would connect to your backend
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'New Job Match',
    message: 'We found a new job that matches your profile!',
    type: 'job_match' as NotificationType,
    isRead: false,
    createdAt: new Date().toISOString(),
    data: { jobId: 'job123' }
  }
];

export const notificationService = {
  getNotifications: async (userId: string, maxNotifications: number = 10): Promise<Notification[]> => {
    // Simulate API call
    return mockNotifications.filter(n => n.userId === userId).slice(0, maxNotifications);
  },

  markAsRead: async (notificationId: string): Promise<boolean> => {
    // Simulate API call
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      return true;
    }
    return false;
  },

  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    return notificationService.markAsRead(notificationId);
  },

  markAllNotificationsAsRead: async (userId: string): Promise<boolean> => {
    mockNotifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    return true;
  },

  createNotification: async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(),
      createdAt: new Date().toISOString()
    };
    mockNotifications.push(newNotification);
    return newNotification;
  },

  subscribeToNotifications: (userId: string, callback: (notifications: Notification[]) => void) => {
    // Mock subscription - in real app, this would use WebSocket or Server-Sent Events
    const interval = setInterval(async () => {
      const notifications = await notificationService.getNotifications(userId);
      callback(notifications);
    }, 30000); // Check every 30 seconds

    return {
      unsubscribe: () => clearInterval(interval)
    };
  }
};

export type { Notification };
