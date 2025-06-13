export interface CompanyProfile {
  id: string;
  companyId: string;
  description: string;
  mission: string;
  culture: string;
  benefits: string[];
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  featuredImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanyUpdate {
  id: string;
  companyId: string;
  title: string;
  content: string;
  updateType: 'news' | 'announcement' | 'milestone' | 'hiring';
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFollower {
  id: string;
  companyId: string;
  userId: string;
  createdAt: string;
}

export interface CompanyTeamMember {
  id: string;
  companyId: string;
  userId: string;
  role: string;
  department?: string;
  isFeatured: boolean;
  testimonial?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyEvent {
  id: string;
  companyId: string;
  title: string;
  description: string;
  eventType: 'webinar' | 'hiring_event' | 'open_house' | 'conference' | 'other';
  startTime: string;
  endTime: string;
  location: {
    type: 'online' | 'physical' | 'hybrid';
    url?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  registrationUrl?: string;
  maxAttendees?: number;
  attendeesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyEventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: 'registered' | 'waitlisted' | 'attended' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export type CompanyProfileWithStats = CompanyProfile & {
  followersCount: number;
  teamMembersCount: number;
  upcomingEventsCount: number;
};
