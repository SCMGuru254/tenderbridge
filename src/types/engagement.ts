export type ActivityType =
  | 'job_view'
  | 'job_apply'
  | 'job_share'
  | 'community_join'
  | 'community_post'
  | 'community_comment'
  | 'profile_view'
  | 'profile_update'
  | 'connection_request'
  | 'endorsement_give'
  | 'recommendation_write';

export type NotificationType =
  | 'job_match'
  | 'application_update'
  | 'connection_request'
  | 'endorsement'
  | 'recommendation'
  | 'community_mention'
  | 'post_reaction'
  | 'comment_reply'
  | 'event_reminder';

export interface ActivityMetadata {
  jobId?: string;
  communityId?: string;
  postId?: string;
  commentId?: string;
  profileId?: string;
  connectionId?: string;
  endorsementId?: string;
  recommendationId?: string;
  duration?: number;
  action?: string;
  result?: string;
  source?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  targetId?: string;
  metadata?: ActivityMetadata;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  notificationType: NotificationType;
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export type AchievementType =
  | 'profile_complete'
  | 'connections_milestone'
  | 'applications_milestone'
  | 'endorsements_milestone'
  | 'community_contributor'
  | 'top_poster'
  | 'helpful_member'
  | 'early_adopter'
  | 'power_user';

export interface Achievement {
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  points: number;
  requirements: {
    metric: string;
    threshold: number;
  };
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementType: AchievementType;
  title: string;
  description: string;
  icon: string;
  awardedAt: string;
  points: number;
}

export interface ReputationCategory {
  name: string;
  score: number;
  level: number;
  lastUpdated: string;
}

export interface UserReputation {
  id: string;
  user_id: string;
  name: string;
  score: number;
  level: number;
  last_updated: string;
}

export type ReputationEventType =
  | 'profile_update'
  | 'job_application'
  | 'endorsement_received'
  | 'post_created'
  | 'comment_liked'
  | 'achievement_earned';

export interface ReputationHistory {
  id: string;
  userId: string;
  eventType: ReputationEventType;
  points: number;
  reason: string;
  timestamp: string;
}

export interface EngagementMetric {
  id: string;
  userId: string;
  metricType: string;
  value: number;
  period: string;
  timestamp: string;
}

export interface UserEngagementSummary {
  totalConnections: number;
  totalPosts: number;
  totalComments: number;
  totalEndorsements: number;
  totalApplications: number;
  reputationByCategory: Record<string, ReputationCategory>;
  recentAchievements: UserAchievement[];
  activityStreak: number;
}
