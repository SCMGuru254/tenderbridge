
export interface UserReputation {
  id: string;
  user_id: string;
  category: string;
  score: number;
  level: string;
  badges: string[];
  last_updated: string;
}

export interface ReputationCategory {
  name: string;
  score: number;
  lastUpdated: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_data: any;
  points_awarded: number;
  achieved_at: string;
  notified: boolean;
}

export interface UserActivity {
  id: string;
  user_id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: any;
}
