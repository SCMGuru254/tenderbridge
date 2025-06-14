
import { handleAsyncError } from '@/utils/errorHandling';

export interface Notification {
  id: string;
  type: 'job_alert' | 'application_update' | 'job_match' | 'system';
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export interface JobAlert {
  id: string;
  name: string;
  userId: string;
  lastTriggered?: string;
  frequency: 'instant' | 'daily' | 'weekly';
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getNotifications(userId: string, maxNotifications?: number): Promise<Notification[]> {
    try {
      // Mock notifications for now - in production this would fetch from database
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'job_alert',
          title: 'New Job Match Found',
          message: 'A new supply chain manager position has been posted that matches your criteria',
          userId,
          isRead: false,
          createdAt: new Date().toISOString(),
          data: { jobId: 'job-123' }
        },
        {
          id: '2',
          type: 'application_update',
          title: 'Application Status Update',
          message: 'Your application for Logistics Coordinator at ABC Corp has been reviewed',
          userId,
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          type: 'system',
          title: 'Welcome to Supply Chain Jobs Kenya',
          message: 'Complete your profile to get better job recommendations',
          userId,
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ];

      return maxNotifications ? mockNotifications.slice(0, maxNotifications) : mockNotifications;
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error fetching notifications:', handledError);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      console.log(`Marking notification ${notificationId} as read`);
      // In production, this would update the database
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error marking notification as read:', handledError);
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      console.log(`Marking all notifications for user ${userId} as read`);
      // In production, this would update the database
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error marking all notifications as read:', handledError);
    }
  }

  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    // Mock subscription - in production this would use real-time updates
    const interval = setInterval(async () => {
      const notifications = await this.getNotifications(userId);
      callback(notifications);
    }, 30000); // Check every 30 seconds

    return {
      unsubscribe: () => clearInterval(interval)
    };
  }
}

export const notificationService = NotificationService.getInstance();
