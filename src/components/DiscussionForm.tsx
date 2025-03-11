
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  content: z.string().min(30, {
    message: "Content must be at least 30 characters.",
  }),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const supplyChainTags = [
  "Logistics", "Procurement", "Inventory", "Warehousing", "Transportation",
  "Manufacturing", "Distribution", "Planning", "Sustainability", "Technology",
  "Risk Management", "Global Trade", "Last Mile", "Supply Chain Finance", 
  "Circular Economy", "Career Development", "Education"
];

export function DiscussionForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useUser();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleTagSelection = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
      form.setValue("tags", [...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    const fileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!fileTypes.includes(file.type)) {
      toast.error("Please upload an image file (JPEG, PNG, or GIF)");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    try {
      setUploading(true);
      
      // In a production environment, you would upload to Supabase Storage
      // For now, we'll create a data URL as a placeholder
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a discussion");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare discussion data
      const discussionData = {
        title: values.title,
        content: values.content,
        author_id: user.id,
        tags: selectedTags,
        image_url: imageUrl, // This would be a Supabase Storage URL in production
      };
      
      // Insert discussion into database
      const { data, error } = await supabase
        .from('discussions')
        .insert(discussionData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success("Discussion created successfully!");
      form.reset();
      setSelectedTags([]);
      setImageUrl(null);
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error("Failed to create discussion. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Avatar>
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">
            {user?.user_metadata?.full_name || 'Anonymous'}
          </h3>
          <p className="text-sm text-gray-500">
            {user?.user_metadata?.position || 'Supply Chain Professional'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discussion Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a clear, specific title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your thoughts, questions, or insights..."
                    className="min-h-[200px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Tags (max 5)</FormLabel>
            <Select
              disabled={selectedTags.length >= 5}
              onValueChange={handleTagSelection}
              value={tagInput}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent>
                {supplyChainTags.map((tag) => (
                  <SelectItem 
                    key={tag} 
                    value={tag}
                    disabled={selectedTags.includes(tag)}
                  >
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
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
          
          <div className="space-y-2">
            <FormLabel>Add Image (optional)</FormLabel>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={!!imageUrl || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            {imageUrl && (
              <div className="relative mt-2 inline-block">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="max-h-40 max-w-full rounded-md" 
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Discussion...
              </>
            ) : (
              'Post Discussion'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
