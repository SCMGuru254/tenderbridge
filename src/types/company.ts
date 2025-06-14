
export interface CompanyEvent {
  id: string;
  title: string;
  description: string;
  eventType: 'webinar' | 'hiring_event' | 'open_house' | 'conference' | 'other';
  startTime: string;
  endTime: string;
  location: {
    type: 'online' | 'hybrid' | 'physical';
    url?: string;
    address?: string;
  };
  maxAttendees?: number;
  attendeesCount: number;
  companyId: string;
  createdAt: string;
}

export interface CompanyMember {
  id: string;
  userId: string;
  role: string;
  department?: string;
  isFeatured: boolean;
  testimonial?: string;
  companyId: string;
  joinedAt: string;
}

export interface CompanyUpdate {
  id: string;
  title: string;
  content: string;
  updateType: 'news' | 'announcement' | 'milestone' | 'hiring';
  mediaUrls?: string[];
  isFeatured: boolean;
  likesCount: number;
  commentsCount: number;
  companyId: string;
  createdAt: string;
}
