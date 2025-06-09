import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Share2, TrendingUp, Users, MessageSquare, Globe, BarChart3 } from "lucide-react";

interface SocialMediaStats {
  shares: number;
  trendingTopics: number;
  userMentions: number;
  messagesSent: number;
  globalReach: number;
  engagementRate: number;
}

const AgentSocialMedia = () => {
  const [stats, setStats] = useState<SocialMediaStats>({
    shares: 0,
    trendingTopics: 0,
    userMentions: 0,
    messagesSent: 0,
    globalReach: 0,
    engagementRate: 0
  });

  useEffect(() => {
    // Simulate loading social media stats
    setStats({
      shares: 450,
      trendingTopics: 12,
      userMentions: 280,
      messagesSent: 950,
      globalReach: 67,
      engagementRate: 32
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Social Media Engagement</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shares</CardTitle>
            <CardDescription>Content shared across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shares}</div>
            <p className="text-sm text-muted-foreground">total shares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>Supply chain topics identified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trendingTopics}</div>
            <p className="text-sm text-muted-foreground">hot topics this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Mentions</CardTitle>
            <CardDescription>Mentions and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userMentions}</div>
            <p className="text-sm text-muted-foreground">user interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages Sent</CardTitle>
            <CardDescription>Direct messages and replies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesSent}</div>
            <p className="text-sm text-muted-foreground">messages sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Global Reach</CardTitle>
            <CardDescription>Audience reach in countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.globalReach}</div>
            <p className="text-sm text-muted-foreground">countries reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
            <CardDescription>Audience engagement percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagementRate}%</div>
            <Progress value={stats.engagementRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentSocialMedia;
