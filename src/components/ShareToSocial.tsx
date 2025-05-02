
import { useState } from 'react';
import { socialMediaAgent } from '../services/agents';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';

interface ShareToSocialProps {
  content: {
    title?: string;
    description?: string;
    url?: string;
  };
}

export function ShareToSocial({ content }: ShareToSocialProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Generate platform-specific posts
      const posts = await socialMediaAgent.generateSocialPost(content, ['twitter', 'linkedin']);
      
      if (posts.length === 0) {
        throw new Error('Failed to generate social media posts');
      }

      // Share to platforms
      const result = await socialMediaAgent.shareToSocialMedia(posts);
      
      if (result.success) {
        toast({
          title: "Shared successfully",
          description: "Your content has been shared to social media",
        });
      } else {
        throw new Error(result.errors.join(', '));
      }
    } catch (error) {
      toast({
        title: "Sharing failed",
        description: error instanceof Error ? error.message : 'Failed to share to social media',
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button 
      onClick={handleShare} 
      disabled={isSharing}
    >
      {isSharing ? 'Sharing...' : 'Share to Social Media'}
    </Button>
  );
}
