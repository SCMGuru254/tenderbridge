import { supabase } from '@/integrations/supabase/client';
import { cache } from '@/utils/cache';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performance';
import { errorHandler } from '@/utils/errorHandling';
import type { JobAlert } from './jobService';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'job_alert' | 'application_update' | 'system' | 'message';
  is_read: boolean;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface NotificationSubscription {
  unsubscribe: () => void;
}

export class NotificationService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      performanceMonitor.startMeasure('fetch-notifications');
      
      const cacheKey = `notifications-${userId}`;
      const cachedNotifications = cache.get<Notification[]>(cacheKey);
      if (cachedNotifications) {
        analytics.trackUserAction('notifications-cache-hit');
        return cachedNotifications;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const notifications = data || [];
      cache.set(cacheKey, notifications, { ttl: this.CACHE_TTL });
      analytics.trackUserAction('notifications-fetch-success', `count:${notifications.length}`);
      
      return notifications;
    } catch (error) {
      errorHandler.handleError(error, 'NETWORK');
      analytics.trackError(error as Error);
      return [];
    } finally {
      performanceMonitor.endMeasure('fetch-notifications');
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>): Promise<Notification | null> {
    try {
      performanceMonitor.startMeasure('create-notification');

      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache
      cache.delete(`notifications-${notification.user_id}`);
      analytics.trackUserAction('notification-create-success');
      
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('create-notification');
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      performanceMonitor.startMeasure('mark-notification-read');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      analytics.trackUserAction('notification-mark-read');
      return true;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return false;
    } finally {
      performanceMonitor.endMeasure('mark-notification-read');
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      performanceMonitor.startMeasure('mark-all-notifications-read');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      // Invalidate cache
      cache.delete(`notifications-${userId}`);
      analytics.trackUserAction('notifications-mark-all-read');
      
      return true;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return false;
    } finally {
      performanceMonitor.endMeasure('mark-all-notifications-read');
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      performanceMonitor.startMeasure('delete-notification');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      analytics.trackUserAction('notification-delete');
      return true;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return false;
    } finally {
      performanceMonitor.endMeasure('delete-notification');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      performanceMonitor.startMeasure('fetch-unread-count');
      
      const cacheKey = `unread-count-${userId}`;
      const cachedCount = cache.get<number>(cacheKey);
      if (cachedCount !== undefined) {
        analytics.trackUserAction('unread-count-cache-hit');
        return cachedCount;
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      const unreadCount = count || 0;
      cache.set(cacheKey, unreadCount, { ttl: this.CACHE_TTL });
      analytics.trackUserAction('unread-count-fetch-success');
      
      return unreadCount;
    } catch (error) {
      errorHandler.handleError(error, 'NETWORK');
      analytics.trackError(error as Error);
      return 0;
    } finally {
      performanceMonitor.endMeasure('fetch-unread-count');
    }
  }

  async processJobAlerts(): Promise<void> {
    try {
      // Get all active job alerts
      const { data: alerts, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('is_active', true);

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
  },

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
  },

  private async triggerJobAlert(alert: JobAlert): Promise<void> {
    try {
      // Get matching jobs
      const { data: jobs, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter jobs based on alert criteria
      const matchingJobs = jobs.filter(job => {
        const searchParams = alert.searchParams;
        return (
          (!searchParams.category || job.title.toLowerCase().includes(searchParams.category.toLowerCase())) &&
          (!searchParams.location || job.location?.toLowerCase().includes(searchParams.location.toLowerCase())) &&
          (!searchParams.jobType || job.job_type === searchParams.jobType) &&
          (!searchParams.isRemote || job.is_remote === searchParams.isRemote)
        );
      });

      if (matchingJobs.length > 0) {
        // Create notification for matching jobs
        await this.createNotification({
          user_id: alert.userId,
          type: 'job_alert',
          title: 'New Jobs Matching Your Alert',
          message: `Found ${matchingJobs.length} new jobs matching your search criteria.`,
          metadata: {
            jobs: matchingJobs,
            alertId: alert.id
          },
          is_read: false
        });

        // Update last triggered timestamp
        await supabase
          .from('job_alerts')
          .update({ last_triggered: new Date().toISOString() })
          .eq('id', alert.id);
      }
    } catch (error) {
      console.error('Error triggering job alert:', error);
    }
  },

  async sendApplicationUpdateNotification(
    userId: string,
    applicationId: string,
    status: string,
    jobTitle: string
  ): Promise<void> {
    try {
      await this.createNotification({
        user_id: userId,
        type: 'application_update',
        title: 'Application Status Updated',
        message: `Your application for "${jobTitle}" has been ${status}.`,
        metadata: {
          applicationId,
          status,
          jobTitle
        },
        is_read: false
      });
    } catch (error) {
      console.error('Error sending application update notification:', error);
    }
  },

  async sendJobMatchNotification(
    userId: string,
    jobId: string,
    jobTitle: string,
    matchScore: number
  ): Promise<void> {
    try {
      await this.createNotification({
        user_id: userId,
        type: 'job_match',
        title: 'New Job Match',
        message: `We found a job that matches your profile: "${jobTitle}" (${Math.round(matchScore * 100)}% match).`,
        metadata: {
          jobId,
          jobTitle,
          matchScore
        },
        is_read: false
      });
    } catch (error) {
      console.error('Error sending job match notification:', error);
    }
  },

  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): NotificationSubscription {
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        async () => {
          // Reload notifications when changes occur
          const notifications = await this.getNotifications(userId);
          callback(notifications);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
      }
    };
  }
}

export const notificationService = new NotificationService(); 