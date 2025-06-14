
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Users, TrendingUp, MessageCircle, Heart, Zap } from 'lucide-react';
import { ShareToSocial } from '@/components/ShareToSocial';
import { socialFeatures } from '@/utils/socialFeatures';
import { toast } from 'sonner';

interface SocialShareHubProps {
  jobTitle?: string;
  jobUrl?: string;
  company?: string;
}

// Remove unused jobId parameter to fix TypeScript warning
export const SocialShareHub = ({ jobTitle, jobUrl, company }: SocialShareHubProps) => {
  const [activeTab, setActiveTab] = useState('share');
  const [socialMetrics, setSocialMetrics] = useState({
    shares: 0,
    likes: 0,
    comments: 0,
    reach: 0
  });

  const handleAIOptimization = async () => {
    if (!jobTitle) return;
    
    try {
      const content = `${jobTitle} at ${company || 'Top Company'}`;
      const optimization = socialFeatures.getContentOptimization(content);
      
      toast.success(`AI Analysis: ${optimization.suggestions.length} suggestions available`);
      console.log('AI Content Optimization:', optimization);
    } catch (error) {
      console.error('AI optimization error:', error);
      toast.error('AI optimization failed');
    }
  };

  const handleViralBoost = async () => {
    try {
      const shareableContent = socialFeatures.generateShareMessage(
        'job',
        jobTitle || 'Great Job Opportunity',
        jobUrl || window.location.href
      );
      
      // Auto-share to multiple platforms
      await socialFeatures.autoPost(shareableContent, ['twitter', 'linkedin']);
      
      setSocialMetrics(prev => ({
        ...prev,
        shares: prev.shares + 2,
        reach: prev.reach + 150
      }));
      
      toast.success('Viral boost activated! Shared across platforms');
    } catch (error) {
      console.error('Viral boost error:', error);
      toast.error('Viral boost failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Share Hub
            <Badge variant="secondary" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="share">Share</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="ai">AI Tools</TabsTrigger>
              <TabsTrigger value="viral">Viral</TabsTrigger>
            </TabsList>

            <TabsContent value="share" className="space-y-4">
              <ShareToSocial 
                jobTitle={jobTitle || 'Job Opportunity'}
                jobUrl={jobUrl}
                company={company}
              />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Share2 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{socialMetrics.shares}</div>
                    <div className="text-sm text-muted-foreground">Shares</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <div className="text-2xl font-bold">{socialMetrics.likes}</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{socialMetrics.comments}</div>
                    <div className="text-sm text-muted-foreground">Comments</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{socialMetrics.reach}</div>
                    <div className="text-sm text-muted-foreground">Reach</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">AI Content Optimization</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get AI-powered suggestions to improve your social media posts
                    </p>
                    <Button onClick={handleAIOptimization} className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Optimize Content
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Smart Hashtag Generator</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      AI-generated hashtags for maximum reach
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {socialFeatures.getSupplyChainHashtags().slice(0, 4).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">Generate More</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="viral" className="space-y-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-lg font-semibold mb-2">Viral Boost</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share across multiple platforms simultaneously with AI-optimized content
                  </p>
                  <Button onClick={handleViralBoost} size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Activate Viral Boost
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
