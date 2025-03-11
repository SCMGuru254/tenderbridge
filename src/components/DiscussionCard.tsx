
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { MessageSquare, Flag, ThumbsUp, Share2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
  position?: string | null;
}

type Discussion = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  updated_at: string;
  profiles: Profile;
  image_url?: string | null;
  tags?: string[] | null;
}

interface DiscussionCardProps {
  discussion: Discussion;
  onReport?: () => void;
}

export function DiscussionCard({ discussion, onReport }: DiscussionCardProps) {
  const { user } = useUser();
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);

  const handleReport = async () => {
    if (!user) {
      toast.error("You must be logged in to report content");
      return;
    }

    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting");
      return;
    }

    setIsReporting(true);

    try {
      // In a production app, you would have a 'discussion_reports' table
      // For now, we'll show a toast as if it was submitted
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      
      toast.success("Report submitted. Thank you for helping keep our community safe.");
      setReportReason("");
      setShowReportDialog(false);
      
      if (onReport) {
        onReport();
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src={discussion.profiles?.avatar_url || undefined} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium">{discussion.profiles?.full_name || 'Anonymous'}</span>
              <p className="text-xs text-gray-500">
                {discussion.profiles?.position || 'Supply Chain Professional'} • {formatDate(discussion.created_at)}
              </p>
            </div>
          </div>
          
          <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                <Flag className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Report Content</AlertDialogTitle>
                <AlertDialogDescription>
                  Please let us know why you're reporting this discussion.
                  Our moderators will review the content.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please provide details about why this content violates community guidelines..."
                className="my-4"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={(e) => {
                    e.preventDefault();
                    handleReport();
                  }}
                  disabled={isReporting}
                >
                  {isReporting ? "Submitting..." : "Submit Report"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <CardTitle className="text-xl mt-3">{discussion.title}</CardTitle>
        
        {discussion.tags && discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {discussion.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 whitespace-pre-line">{discussion.content}</p>
        
        {discussion.image_url && (
          <div className="mt-4">
            <img 
              src={discussion.image_url} 
              alt="Discussion image"
              className="rounded-md max-h-96 object-contain"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Comment</span>
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
