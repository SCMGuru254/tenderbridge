export type ActionType = 
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'search'
  | 'filter'
  | 'apply'
  | 'share'
  | 'save'
  | 'engagement';

export type InteractionType =
  | 'view'
  | 'apply'
  | 'share'
  | 'save'
  | 'click_details'
  | 'contact_employer';

export interface ActionDetails {
  target?: string;
  value?: string | number;
  location?: { x: number; y: number };
  duration?: number;
  path?: string;
  referrer?: string;
}

export interface UserAnalytics {
  id: string;
  user_id: string;
  page_view: string;
  action_type: ActionType;
  action_details?: ActionDetails;
  session_id: string;
  created_at: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface JobAnalytics {
  id: string;
  job_id: string;
  interaction_type: InteractionType;
  user_id?: string;
  duration?: number;
  created_at: string;
  conversion_status?: 'viewed' | 'applied' | 'hired' | 'rejected';
  metadata?: Record<string, string | number | boolean>;
}

export interface SocialAnalytics {
  id: string;
  feature_type: 'posts' | 'comments' | 'shares' | 'likes' | 'connections';
  engagement_count: number;
  unique_users: number;
  conversion_rate?: number;
  time_period: [string, string];
  created_at: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface TestVariant {
  name: string;
  weight: number;
  config: Record<string, unknown>;
}

export interface TestResults {
  variant: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  metrics: Record<string, number>;
}

export interface ABTest {
  id: string;
  test_name: string;
  variant: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  variants: TestVariant[];
  results?: TestResults;
}

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
  value: string | number | boolean | Array<string | number>;
}

export interface UserSegment {
  id: string;
  segment_name: string;
  criteria: SegmentCriteria[];
  created_at: string;
  updated_at: string;
}

export interface PerformanceMetric {
  id: string;
  metric_type: string;
  value: number;
  timestamp: string;
  component?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  day: string;
  unique_users: number;
  total_interactions: number;
  action_type: string;
  page_view: string;
}
