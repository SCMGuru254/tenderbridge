
import { supabase } from '@/integrations/supabase/client';
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

  // Fetch notifications from Supabase
  async getNotifications(userId: string, maxNotifications?: number): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (maxNotifications) {
        query = query.limit(maxNotifications);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Map to Notification interface used by frontend
      const notifications: Notification[] = (data || []).map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        userId: n.user_id,
        isRead: n.is_read,
        createdAt: n.created_at,
        data: n.data || undefined,
      }));

      return notifications;
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error fetching notifications:', handledError);
      return [];
    }
  }

  // Mark a notification as read in Supabase
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error marking notification as read:', handledError);
    }
  }

  // Mark all notifications for a user as read in Supabase
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      const handledError = handleAsyncError(error as Error, 'CLIENT');
      console.error('Error marking all notifications as read:', handledError);
    }
  }

  // Real subscription would need Supabase Realtime or polling
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    // For now, fallback to polling (since Realtime may not be set up for notifications table)
    const interval = setInterval(async () => {
      const notifications = await this.getNotifications(userId);
      callback(notifications);
    }, 30000);

    return {
      unsubscribe: () => clearInterval(interval)
    };
  }
}

export const notificationService = NotificationService.getInstance();

