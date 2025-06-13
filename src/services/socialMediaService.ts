
import { SocialPost } from '@/types/social';

export class SocialMediaService {
  private posts: SocialPost[] = [];

  async createPost(content: string, platform: string): Promise<SocialPost> {
    const post: SocialPost = {
      id: Date.now().toString(),
      content,
      platform,
      timestamp: Date.now(),
      likes: 0,
      shares: 0,
      comments: []
    };

    this.posts.push(post);
    return post;
  }

  async getPosts(): Promise<SocialPost[]> {
    return [...this.posts];
  }

  async likePost(postId: string): Promise<void> {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
    }
  }

  async sharePost(postId: string): Promise<void> {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.shares += 1;
    }
  }
}

export const socialMediaService = new SocialMediaService();
