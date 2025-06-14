
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, MessageCircle, Share2, Heart, Award } from 'lucide-react';
import { toast } from 'sonner';

interface NetworkConnection {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  mutualConnections: number;
  isConnected: boolean;
  lastActive: string;
}

interface Post {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

export const SocialNetworking = () => {
  const [connections] = useState<NetworkConnection[]>([
    {
      id: '1',
      name: 'Sarah Wanjiku',
      title: 'Supply Chain Manager',
      company: 'Unilever Kenya',
      mutualConnections: 12,
      isConnected: true,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'James Ochieng',
      title: 'Logistics Coordinator',
      company: 'Safaricom',
      mutualConnections: 8,
      isConnected: false,
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Grace Kiprotich',
      title: 'Procurement Specialist',
      company: 'Kenya Airways',
      mutualConnections: 15,
      isConnected: true,
      lastActive: '30 minutes ago'
    }
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah Wanjiku',
      content: 'Just completed our Q4 supply chain optimization project. Reduced costs by 15% while improving delivery times. Excited to share learnings with the community! #SupplyChain #Innovation',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 5,
      shares: 3,
      isLiked: false
    },
    {
      id: '2',
      author: 'James Ochieng',
      content: 'Looking for recommendations on best practices for cold chain logistics in Kenya. Any insights from fellow professionals? #ColdChain #Logistics',
      timestamp: '4 hours ago',
      likes: 18,
      comments: 12,
      shares: 2,
      isLiked: true
    }
  ]);

  // Remove unused connectionId parameter to fix TypeScript warning
  const handleConnect = () => {
    toast.success('Connection request sent!');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
    toast.success('Post shared!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Professional Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-4">
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar>
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{post.author}</h3>
                            <Badge variant="outline" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                        </div>
                      </div>
                      
                      <p className="mb-4 text-sm leading-relaxed">{post.content}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={post.isLiked ? 'text-red-500' : ''}
                          >
                            <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            {post.shares}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <div className="grid gap-4">
                {connections.filter(c => c.isConnected).map((connection) => (
                  <Card key={connection.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={connection.avatar} />
                            <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{connection.name}</h3>
                            <p className="text-sm text-muted-foreground">{connection.title}</p>
                            <p className="text-sm text-muted-foreground">{connection.company}</p>
                            <p className="text-xs text-muted-foreground">Active {connection.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discover" className="space-y-4">
              <div className="grid gap-4">
                {connections.filter(c => !c.isConnected).map((connection) => (
                  <Card key={connection.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={connection.avatar} />
                            <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{connection.name}</h3>
                            <p className="text-sm text-muted-foreground">{connection.title}</p>
                            <p className="text-sm text-muted-foreground">{connection.company}</p>
                            <p className="text-xs text-blue-600">{connection.mutualConnections} mutual connections</p>
                          </div>
                        </div>
                        <Button
                          onClick={handleConnect}
                          size="sm"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
