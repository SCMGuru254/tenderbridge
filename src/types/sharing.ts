
export interface JobReferral {
  id: string;
  job_id: string;
  referrer_id: string;
  referee_email: string;
  message?: string;
  status: 'pending' | 'contacted' | 'hired' | 'declined';
  created_at: string;
}

export interface ShareTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  created_at: string;
}

export interface SuccessStory {
  id: string;
  user_id: string;
  title: string;
  content: string;
  job_id?: string;
  created_at: string;
}
