
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

interface ShareToSocialProps {
  jobTitle: string;
  jobUrl?: string;
  company?: string;
}

export const ShareToSocial = ({ jobTitle, jobUrl, company }: ShareToSocialProps) => {
  const [customMessage, setCustomMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const generateDefaultMessage = () => {
    return `Check out this amazing job opportunity: ${jobTitle}${company ? ` at ${company}` : ''}! #Jobs #Career #Opportunity`;
  };

  const handleShare = async (platform: string) => {
    setIsSharing(true);
    try {
      const message = customMessage || generateDefaultMessage();
      const shareUrl = jobUrl || window.location.href;
      
      let shareLink = '';
      
      switch (platform) {
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case 'linkedin':
          shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        default:
          toast.error('Platform not supported');
          return;
      }
      
      window.open(shareLink, '_blank', 'width=600,height=400');
      toast.success(`Shared to ${platform}!`);
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Job
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Custom Message (Optional)</label>
          <Textarea
            placeholder={generateDefaultMessage()}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleShare('twitter')}
            disabled={isSharing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          
          <Button
            onClick={() => handleShare('facebook')}
            disabled={isSharing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          
          <Button
            onClick={() => handleShare('linkedin')}
            disabled={isSharing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
