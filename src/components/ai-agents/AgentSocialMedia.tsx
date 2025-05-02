
import { useState } from "react";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AIAgent, AGENT_ROLES, socialMediaAgent } from "@/services/agents"; // Fixed import path
import { useToast } from "@/hooks/use-toast";
import type { SocialPost } from "@/services/socialMediaService";

export default function AgentSocialMedia() {
  const [contentIdea, setContentIdea] = useState("");
  const [platforms, setPlatforms] = useState<Array<"twitter" | "linkedin" | "facebook" | "instagram">>([
    "twitter", "linkedin"
  ]);
  const [generatedPosts, setGeneratedPosts] = useState<SocialPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleTogglePlatform = (platform: "twitter" | "linkedin" | "facebook" | "instagram") => {
    setPlatforms(current => 
      current.includes(platform) 
        ? current.filter(p => p !== platform)
        : [...current, platform]
    );
  };

  const handleGeneratePosts = async () => {
    if (!contentIdea.trim() || platforms.length === 0) {
      toast({
        title: "Missing information",
        description: "Please enter content idea and select at least one platform",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const content = {
        topic: contentIdea,
        industry: "supply chain",
        tone: "professional"
      };
      
      const posts = await socialMediaAgent.generateSocialPost(content, platforms);
      setGeneratedPosts(posts);
      
      if (posts.length === 0) {
        throw new Error("No posts were generated");
      }
      
    } catch (error) {
      console.error("Post generation error:", error);
      toast({
        title: "Generation failed",
        description: "Unable to generate social media posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSharePosts = async () => {
    if (generatedPosts.length === 0) return;
    
    setIsSharing(true);
    
    try {
      const result = await socialMediaAgent.shareToSocialMedia(generatedPosts);
      
      if (result.success) {
        toast({
          title: "Posts shared",
          description: "Your posts have been shared to the selected platforms."
        });
      } else {
        throw new Error(result.errors.join(", "));
      }
      
    } catch (error) {
      console.error("Sharing error:", error);
      toast({
        title: "Sharing failed",
        description: error instanceof Error ? error.message : "Failed to share posts. Please ensure your social accounts are connected."
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Assistant</CardTitle>
        <CardDescription>
          Generate and share supply chain content to social media
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="contentIdea">Content Idea or Topic</Label>
          <Textarea 
            id="contentIdea"
            placeholder="e.g., New trends in sustainable logistics" 
            className="min-h-[100px]"
            value={contentIdea}
            onChange={(e) => setContentIdea(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Target Platforms</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="twitter" 
                checked={platforms.includes("twitter")}
                onCheckedChange={() => handleTogglePlatform("twitter")}
              />
              <label htmlFor="twitter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Twitter
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="linkedin" 
                checked={platforms.includes("linkedin")}
                onCheckedChange={() => handleTogglePlatform("linkedin")}
              />
              <label htmlFor="linkedin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                LinkedIn
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="facebook" 
                checked={platforms.includes("facebook")}
                onCheckedChange={() => handleTogglePlatform("facebook")}
              />
              <label htmlFor="facebook" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Facebook
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="instagram" 
                checked={platforms.includes("instagram")}
                onCheckedChange={() => handleTogglePlatform("instagram")}
              />
              <label htmlFor="instagram" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Instagram
              </label>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleGeneratePosts}
          disabled={isGenerating || !contentIdea.trim() || platforms.length === 0}
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate Posts"}
        </Button>
        
        {generatedPosts.length > 0 && (
          <div className="mt-6 space-y-4">
            <Separator />
            <h3 className="font-medium">Generated Posts:</h3>
            
            <Tabs defaultValue={generatedPosts[0]?.platform || "twitter"}>
              <TabsList className="grid grid-cols-4 mb-4">
                {generatedPosts.map(post => (
                  <TabsTrigger key={post.platform} value={post.platform}>{post.platform}</TabsTrigger>
                ))}
              </TabsList>
              
              {generatedPosts.map(post => (
                <TabsContent key={post.platform} value={post.platform}>
                  <div className="p-4 border rounded-lg">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <Button
              onClick={handleSharePosts}
              disabled={isSharing}
              className="w-full"
            >
              {isSharing ? "Sharing..." : "Share Posts"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
