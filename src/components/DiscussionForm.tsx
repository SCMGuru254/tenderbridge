
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

export interface DiscussionFormProps {
  onSuccess?: () => void;
}

export const DiscussionForm = ({ onSuccess }: DiscussionFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a discussion");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          title: title.trim(),
          content: content.trim(),
          author_id: user.id
        });

      if (error) throw error;

      toast.success("Discussion created successfully!");
      setTitle("");
      setContent("");
      onSuccess?.();
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast.error("Failed to create discussion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a New Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={6}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="w-full"
          >
            {isSubmitting ? "Creating..." : "Create Discussion"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DiscussionForm;
