import { supabase } from '@/lib/supabaseClient';
import { JobAlert } from '@/types/jobs';
import { Notification, NotificationType } from '@/types/notifications';

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async createNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt'>) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{ ...notification, user_id: userId }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return data?.length ?? 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async processJobAlerts(): Promise<void> {
    try {
      const { data: alerts, error } = await supabase
        .from('job_alerts')
        .select('*');

      if (error) throw error;

      for (const alert of alerts) {
        const shouldTrigger = this.shouldTriggerAlert(alert);
        if (shouldTrigger) {
          await this.triggerJobAlert(alert);
        }
      }
    } catch (error) {
      console.error('Error processing job alerts:', error);
    }
  }

  private shouldTriggerAlert(alert: JobAlert): boolean {
    const now = new Date();
    const lastTriggered = alert.lastTriggered ? new Date(alert.lastTriggered) : null;

    switch (alert.frequency) {
      case 'instant':
        return true;
      case 'daily':
        if (!lastTriggered) return true;
        const hoursSinceLastTrigger = (now.getTime() - lastTriggered.getTime()) / (1000 * 60 * 60);
        return hoursSinceLastTrigger >= 24;
      case 'weekly':
        if (!lastTriggered) return true;
        const daysSinceLastTrigger = (now.getTime() - lastTriggered.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastTrigger >= 7;
      default:
        return false;
    }
  }

  private async triggerJobAlert(alert: JobAlert): Promise<void> {
    try {
      // Create a notification for the job alert
      await this.createNotification(alert.userId, {
        type: 'job_alert' as NotificationType,
        title: 'New Job Matches',
        message: `New jobs matching your alert "${alert.name}" are available.`,
        userId: alert.userId,
        isRead: false
      });

      // Update the last triggered timestamp
      const { error } = await supabase
        .from('job_alerts')
        .update({ lastTriggered: new Date().toISOString() })
        .eq('id', alert.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error triggering job alert:', error);
    }
  }
}