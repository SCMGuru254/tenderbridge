export interface JobReferral {
  id: string;
  userId: string;
  jobId: string;
  referredUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShareTemplate {
  id: string;
  userId: string;
  templateType: 'job' | 'success_story' | 'general';
  title: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SuccessStory {
  id: string;
  userId: string;
  jobId?: string;
  title: string;
  content: string;
  metrics?: {
    timeToHire?: number;
    salary?: number;
    otherDetails?: Record<string, any>;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SharingAnalytics {
  id: string;
  userId: string;
  contentType: 'job' | 'success_story' | 'referral';
  contentId: string;
  platform: 'linkedin' | 'twitter' | 'email' | 'other';
  clicks: number;
  impressions: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
}
