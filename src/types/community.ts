
export interface Community {
  id: string;
  name: string;
  description?: string;
  category?: string;
  member_count: number;
  is_private: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}
