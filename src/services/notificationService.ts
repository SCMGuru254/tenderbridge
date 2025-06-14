
import { supabase } from '@/integrations/supabase/client';

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

  async getNotifications(userId: string, limit: number = 10): Promise<Notification[]> {
    try {
      // Mock notifications for now
      return [
        {
          id: '1',
          type: 'job_alert',
          title: 'New Job Match',
          message: 'A new job matching your criteria has been posted',
          userId,
          isRead: false,
          createdAt: new Date().toISOString(),
        }
      ];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      console.log(`Marking notification ${notificationId} as read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      console.log(`Marking all notifications for user ${userId} as read`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    // Mock subscription
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
