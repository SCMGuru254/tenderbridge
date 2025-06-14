
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, Share2, Brain, TrendingUp } from "lucide-react";
import { AIJobRecommendations } from "@/components/ai/AIJobRecommendations";
import { SocialShareHub } from "@/components/social/SocialShareHub";
import { SocialNetworking } from "@/components/social/SocialNetworking";
import AgentSocialMedia from "@/components/ai-agents/AgentSocialMedia";

export default function SocialHub() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Social & AI Hub
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Powered by artificial intelligence and professional networking
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="h-3 w-3 mr-1" />
              Social Network
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Smart Analytics
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="ai-recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Jobs
            </TabsTrigger>
            <TabsTrigger value="social-network" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Network
            </TabsTrigger>
            <TabsTrigger value="social-share" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Hub
            </TabsTrigger>
            <TabsTrigger value="ai-agents" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Agents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI-Powered Job Recommendations
                </CardTitle>
                <CardDescription>
                  Get personalized job recommendations based on your profile, skills, and career goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIJobRecommendations />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social-network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Professional Network
                </CardTitle>
                <CardDescription>
                  Connect with supply chain professionals across Kenya and beyond
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialNetworking />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social-share" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Share Hub
                </CardTitle>
                <CardDescription>
                  Share opportunities and grow your professional presence with AI-optimized content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialShareHub />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-agents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Social Media Manager
                </CardTitle>
                <CardDescription>
                  Automated social media management and content optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgentSocialMedia />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
