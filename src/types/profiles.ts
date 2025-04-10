
export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: string | null;
  company: string | null;
  position: string | null;
  bio: string | null;
  linkedin_url: string | null;
  cv_url: string | null;
  cv_filename: string | null;
  notify_on_view: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileView {
  id: string;
  profile_id: string;
  viewer_id: string;
  viewer: Profile;
  viewed_at: string;
}

export interface HiringDecision {
  id: string;
  employer_id: string;
  candidate_id: string;
  employer: Profile;
  decision_date: string;
  notes: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}
