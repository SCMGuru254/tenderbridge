
export interface CompanyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'online' | 'hybrid' | 'physical';
  attendees: number;
}

export interface CompanyMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  joinedAt: string;
}

export interface CompanyUpdate {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  attachments?: string[];
}
