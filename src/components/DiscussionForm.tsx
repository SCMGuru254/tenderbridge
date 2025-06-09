
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DiscussionFormProps {
  onDiscussionCreated?: () => void;
}

const PREDEFINED_TAGS = [
  "Career Advice",
  "Job Search",
  "Interview Tips",
  "Supply Chain",
  "Logistics",
  "Procurement",
  "Networking",
  "Industry News",
  "Salary Discussion",
  "Work-Life Balance"
];

export const DiscussionForm = ({ onDiscussionCreated }: DiscussionFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a discussion");
        return;
      }

      const { error } = await supabase
        .from('discussions')
        .insert({
          title: title.trim(),
          content: content.trim(),
          author_id: user.id,
          tags: selectedTags,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating discussion:', error);
        toast.error("Failed to create discussion");
        return;
      }

      // Reset form
      setTitle("");
      setContent("");
      setSelectedTags([]);
      
      toast.success("Discussion created successfully!");
      
      if (onDiscussionCreated) {
        onDiscussionCreated();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred");
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
            <Input
              placeholder="Discussion title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>
          
          <div>
            <Textarea
              placeholder="What would you like to discuss?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={2000}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Add Tags (select up to 5)</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {PREDEFINED_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
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
