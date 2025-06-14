
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_alert' | 'application_update' | 'job_match' | 'system';
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

class NotificationService {
  async getNotifications(userId: string, maxNotifications: number = 10): Promise<Notification[]> {
    // Mock implementation - replace with actual API call
    return [
      {
        id: '1',
        userId,
        title: 'New Job Match',
        message: 'A new job matching your skills has been posted',
        type: 'job_match',
        isRead: false,
        createdAt: new Date().toISOString(),
        data: { jobId: 'job-123' }
      }
    ].slice(0, maxNotifications);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    console.log('Marking notification as read:', notificationId);
    // Mock implementation
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    console.log('Marking all notifications as read for user:', userId);
    // Mock implementation
  }

  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    console.log('Subscribing to notifications for user:', userId);
    // Mock implementation
    const interval = setInterval(async () => {
      const notifications = await this.getNotifications(userId);
      callback(notifications);
    }, 30000);

    return {
      unsubscribe: () => clearInterval(interval)
    };
  }

  async createNotification(userId: string, title: string, message: string, type: Notification['type'], data?: Record<string, any>): Promise<void> {
    console.log('Creating notification:', { userId, title, message, type, data });
    // Mock implementation
  }
}

export const notificationService = new NotificationService();
export { NotificationService };
