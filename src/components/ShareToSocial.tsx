
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareToSocialProps {
  jobTitle: string;
  jobUrl?: string;
  company?: string;
}

export const ShareToSocial = ({ jobTitle, jobUrl, company }: ShareToSocialProps) => {
  const [customMessage, setCustomMessage] = useState('');
  const [customUrl, setCustomUrl] = useState(jobUrl || '');
  const [isSharing, setIsSharing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [shareCount, setShareCount] = useState({ twitter: 0, facebook: 0, linkedin: 0 });

  const generateDefaultMessage = () => {
    return `Check out this amazing job opportunity: ${jobTitle}${company ? ` at ${company}` : ''}! #Jobs #Career #Opportunity`;
  };

  const handleCopyUrl = async () => {
    const urlToCopy = customUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedUrl(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  const handleShare = async (platform: string) => {
    setIsSharing(true);
    try {
      const message = customMessage || generateDefaultMessage();
      const shareUrl = customUrl || window.location.href;
      
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
      
      // Update share count
      setShareCount(prev => ({
        ...prev,
        [platform]: prev[platform as keyof typeof prev] + 1
      }));
      
      toast.success(`Shared to ${platform}!`);
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    } finally {
      setIsSharing(false);
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-500 text-white';
      case 'facebook': return 'bg-blue-600 text-white';
      case 'linkedin': return 'bg-blue-700 text-white';
      default: return 'bg-gray-500 text-white';
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
          <label className="text-sm font-medium">Custom URL (Optional)</label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder={jobUrl || window.location.href}
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              {copiedUrl ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copiedUrl ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Custom Message (Optional)</label>
          <Textarea
            placeholder={generateDefaultMessage()}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleShare('twitter')}
              disabled={isSharing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
              {shareCount.twitter > 0 && (
                <Badge className={getPlatformBadgeColor('twitter')}>
                  {shareCount.twitter}
                </Badge>
              )}
            </Button>
            
            <Button
              onClick={() => handleShare('facebook')}
              disabled={isSharing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
              {shareCount.facebook > 0 && (
                <Badge className={getPlatformBadgeColor('facebook')}>
                  {shareCount.facebook}
                </Badge>
              )}
            </Button>
            
            <Button
              onClick={() => handleShare('linkedin')}
              disabled={isSharing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
              {shareCount.linkedin > 0 && (
                <Badge className={getPlatformBadgeColor('linkedin')}>
                  {shareCount.linkedin}
                </Badge>
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">Available Platforms</Badge>
            <Badge className={getPlatformBadgeColor('twitter')}>Twitter</Badge>
            <Badge className={getPlatformBadgeColor('facebook')}>Facebook</Badge>
            <Badge className={getPlatformBadgeColor('linkedin')}>LinkedIn</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
