
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share2 } from "lucide-react";

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  engagement: number;
  status: 'scheduled' | 'posted' | 'draft';
}

const AgentSocialMedia = () => {
  const [posts] = useState<SocialPost[]>([
    {
      id: "1",
      platform: "LinkedIn",
      content: "New opportunities in supply chain management are emerging...",
      engagement: 156,
      status: "posted"
    },
    {
      id: "2",
      platform: "Twitter",
      content: "Breaking: Major logistics company announces expansion in East Africa",
      engagement: 89,
      status: "scheduled"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media Manager
          </CardTitle>
          <CardDescription>Automated social media content and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium">{post.platform}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                    <div className="text-xs text-muted-foreground">
                      Engagement: {post.engagement} interactions
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentSocialMedia;
