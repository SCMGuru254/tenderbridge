
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  position: string | null;
  bio: string | null;
  linkedin_url: string | null;
  cv_url: string | null;
  cv_filename: string | null;
  role: string;
  notify_on_view: boolean;
  tagline: string | null;
  previous_job: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileView {
  id: string;
  profile_id: string;
  viewer_id: string;
  viewer: {
    id: string;
    full_name: string | null;
    company: string | null;
    avatar_url: string | null;
  };
  viewed_at: string;
}

export interface HiringDecision {
  id: string;
  employer_id: string;
  candidate_id: string;
  employer: {
    id: string;
    full_name: string | null;
    company: string | null;
    avatar_url: string | null;
  };
  decision_date: string;
  notes: string | null;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Poll {
  id: string;
  discussion_id: string;
  question: string;
  expires_at: string | null;
  created_at: string;
  created_by: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  votes_count: number;
  created_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  voted_at: string;
}
