export interface Connection {
  id: string;
  requestor_id: string;
  target_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  connection_level: number;
  created_at: string;
  updated_at: string;
}

export interface SkillEndorsement {
  id: string;
  endorser_id: string;
  endorsed_id: string;
  skill: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalRecommendation {
  id: string;
  recommender_id: string;
  recommended_id: string;
  content: string;
  relationship: string;
  duration: string;
  status: 'pending' | 'published' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ConnectionSuggestion {
  suggested_user_id: string;
  full_name: string;
  position: string;
  company: string;
  common_connections: number;
  common_skills: number;
}
