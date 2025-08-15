
export enum NotificationType {
  SYSTEM = 'system',
  JOB_ALERT = 'job_alert',
  APPLICATION_UPDATE = 'application_update',
  JOB_MATCH = 'job_match',
  CONNECTION_REQUEST = 'connection_request',
  CONNECTION_ACCEPTED = 'connection_accepted',
  ROLE_CHANGE = 'role_change',
  PROFILE_VIEW = 'profile_view'
}

export interface NotificationData {
  userId?: string;
  avatarUrl?: string;
  connection_id?: string;
  userName?: string;
  oldRole?: string;
  newRole?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  data?: NotificationData;
}
