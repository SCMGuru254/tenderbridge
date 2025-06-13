export interface Community {
  id: string;
  name: string;
  description?: string;
  category: string;
  rules: string[];
  avatarUrl?: string;
  bannerUrl?: string;
  isPrivate: boolean;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string;
  mediaUrls: string[];
  postType: 'discussion' | 'question' | 'resource' | 'event' | 'job';
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likesCount: number;
  parentCommentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostReaction {
  id: string;
  postId?: string;
  commentId?: string;
  userId: string;
  reactionType: string;
  createdAt: string;
}

export interface CommunityTag {
  id: string;
  communityId: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface CommunityWithMembership extends Community {
  currentUserRole?: CommunityMember['role'];
}

export interface PostWithAuthor extends CommunityPost {
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  tags: CommunityTag[];
  hasLiked?: boolean;
}

export interface CommentWithAuthor extends CommunityPostComment {
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  hasLiked?: boolean;
  replies?: CommentWithAuthor[];
}
