import { useState, useEffect } from 'react';

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  createdAt: string;
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

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      // Mock implementation
      setCommunities([
        {
          id: '1',
          name: 'Supply Chain Professionals',
          description: 'Connect with other supply chain professionals',
          memberCount: 1250,
          isPrivate: false,
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (err) {
      setError('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  const createCommunity = async (community: Omit<Community, 'id' | 'memberCount' | 'createdAt'>) => {
    console.log('Creating community:', community);
    // Mock implementation
  };

  return { communities, loading, error, createCommunity, refetch: loadCommunities };
};

export const useCommunityPosts = (communityId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // Mock implementation
      setPosts([
        {
          id: '1',
          title: 'Welcome to the community!',
          content: 'Hello everyone, welcome to our supply chain community!',
          author: 'Admin',
          createdAt: new Date().toISOString(),
          likes: 15,
          comments: 3,
          tags: ['welcome', 'community'],
          replies: []
        }
      ]);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [communityId]);

  const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    console.log('Creating post:', post);
    // Mock implementation
  };

  return { posts, loading, createPost };
};
