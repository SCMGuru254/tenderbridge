
export interface JobAnalytics {
  totalViews: number;
  uniqueViewers: number;
  applications: number;
  saveCount: number;
  shareCount: number;
  averageTimeSpent: number;
}

export interface JobAlert {
  id: string;
  userId: string;
  searchParams: {
    category?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    isRemote?: boolean;
  };
  isActive: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  lastTriggered?: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  appliedAt: string;
  notes?: string;
  nextSteps?: string;
  interviewDate?: string;
}
