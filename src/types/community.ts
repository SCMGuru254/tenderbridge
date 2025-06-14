
export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  createdAt: string;
  category?: string;
  bannerUrl?: string;
  avatarUrl?: string;
}

export interface CommunityWithMembership extends Community {
  currentUserRole?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
  attachments?: string[];
  replies?: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}
