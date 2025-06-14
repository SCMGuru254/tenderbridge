
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
  getNotifications: async (userId: string): Promise<Notification[]> => {
    // Simulate API call
    return mockNotifications.filter(n => n.userId === userId);
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

  createNotification: async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(),
      createdAt: new Date().toISOString()
    };
    mockNotifications.push(newNotification);
    return newNotification;
  }
};
