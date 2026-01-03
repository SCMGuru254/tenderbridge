import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share2, Twitter, Linkedin, MessageCircle, Link2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SocialShareProps {
  jobId: string;
  jobTitle: string;
  company: string;
  className?: string;
}

const SHARE_POINTS = 10; // Points awarded per share

export function SocialShare({ jobId, jobTitle, company, className }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  const shareUrl = `${window.location.origin}/#/job/${jobId}`;
  const shareText = `Check out this opportunity: ${jobTitle} at ${company}`;

  const recordShare = async (platform: string) => {
    try {
      setSharing(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.info("Sign in to earn points for sharing!");
        return;
      }

      // Award points via RPC (Secure)
      const { data: pointsData, error: pointsError } = await supabase.rpc('award_share_points', {
        p_user_id: user.id,
        p_job_id: jobId,
        p_platform: platform
      });

      if (pointsError) {
        console.error('Points award failed:', pointsError);
      } else if (pointsData?.success) {
        toast.success(`+${pointsData.points_earned} points earned for sharing! 🎉`, {
          icon: <Trophy className="h-4 w-4 text-yellow-500" />
        });
      }
    } catch (error) {
      console.error('Error recording share:', error);
    } finally {
      setSharing(false);
    }
  };

  const handleTwitterShare = async () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    await recordShare('Twitter');
    setIsOpen(false);
  };

  const handleLinkedInShare = async () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=730');
    await recordShare('LinkedIn');
    setIsOpen(false);
  };

  const handleWhatsAppShare = async () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
    await recordShare('WhatsApp');
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      await recordShare('CopyLink');
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={className}
          disabled={sharing}
        >
          <Share2 className="h-5 w-5 sm:h-4 sm:w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share This Job
          </DialogTitle>
          <DialogDescription>
            Share to earn {SHARE_POINTS} points! Help others discover this opportunity.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            onClick={handleTwitterShare}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600"
            disabled={sharing}
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>

          <Button
            onClick={handleLinkedInShare}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800"
            disabled={sharing}
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>

          <Button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            disabled={sharing}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>

          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="flex items-center gap-2"
            disabled={sharing}
          >
            <Link2 className="h-4 w-4" />
            Copy Link
          </Button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Earn <strong>{SHARE_POINTS} points</strong> for each share!</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
