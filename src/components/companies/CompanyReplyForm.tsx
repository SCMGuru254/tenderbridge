import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Building2, MessageSquare } from "lucide-react";

interface CompanyReplyFormProps {
  reviewId: string;
  companyName: string;
  onReplyAdded: () => void;
}

const CompanyReplyForm = ({ reviewId, companyName, onReplyAdded }: CompanyReplyFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reply to reviews",
        variant: "destructive",
      });
      return;
    }

    if (!reply.trim()) {
      toast({
        title: "Reply required",
        description: "Please enter a reply before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First check if user owns the company
      const { data: company } = await supabase
        .from('companies')
        .select('id, name')
        .eq('user_id', user.id)
        .single();

      if (!company) {
        toast({
          title: "Access denied",
          description: "Only verified company owners can reply to reviews",
          variant: "destructive",
        });
        return;
      }

      // Insert the reply
      const { error } = await supabase
        .from('company_review_replies')
        .insert({
          review_id: reviewId,
          company_id: company.id,
          reply_text: reply.trim(),
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Reply posted successfully",
        description: "Your response to the review has been published",
      });

      setReply("");
      onReplyAdded();
    } catch (error: any) {
      console.error("Reply submission error:", error);
      toast({
        title: "Failed to post reply",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Company Response
          <Badge variant="secondary" className="ml-2">
            <Building2 className="h-3 w-3 mr-1" />
            {companyName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write a professional response to this review..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            disabled={isSubmitting}
            rows={4}
            maxLength={1000}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {reply.length}/1000 characters
            </span>
            <Button
              type="submit"
              disabled={isSubmitting || !reply.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyReplyForm;