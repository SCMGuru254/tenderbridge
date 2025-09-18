export interface AnonymousSettings {
  id: string;
  user_id: string;
  default_anonymous: boolean;
  preferred_anonymous_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnonymousContent {
  is_anonymous: boolean;
  anonymous_display_name: string | null;
  anonymous_identifier: string;
}

export interface AnonymousUser {
  id: string;
  anonymous_id: string;
  display_name: string;
}

// Rate limiting types
export interface RateLimit {
  key: string;
  points: number;
  duration: number; // in seconds
}