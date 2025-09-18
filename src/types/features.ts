export interface ReviewComment {
  id: string;
  review_id: string;
  user_id: string;
  comment_text: string;
  is_anonymous: boolean;
  parent_comment_id?: string;
  status: 'active' | 'hidden' | 'flagged';
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
  replies?: ReviewComment[];
}

export interface ReviewHelpfulVote {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at: string;
}

export interface JobSkill {
  id: string;
  job_id: string;
  skill_name: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  is_required: boolean;
  created_at: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_category_id?: string;
  icon_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Discussion {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: 'general' | 'technical' | 'career' | 'industry' | 'education';
  tags: string[];
  is_anonymous: boolean;
  is_locked: boolean;
  view_count: number;
  status: 'active' | 'hidden' | 'locked' | 'flagged';
  created_at: string;
  updated_at: string;
}