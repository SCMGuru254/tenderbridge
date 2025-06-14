
export type NotificationType = 'system' | 'job_alert' | 'application_update' | 'job_match';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}
