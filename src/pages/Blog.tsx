import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, User, Filter, MessageSquare, PenSquare } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewsRefreshButton } from "@/components/NewsRefreshButton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  published_date: string;
  source_name: string;
  source_url: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  tags?: string[];
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

const supplyChainTags = [
  "Logistics", "Procurement", "Inventory", "Warehousing", "Transportation",
  "Manufacturing", "Distribution", "Planning", "Sustainability", "Technology",
  "Risk Management", "Global Trade", "Last Mile", "Supply Chain Finance", 
  "Circular Economy", "Career Development", "Education"
];

const Blog = () => {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: news, isLoading: isLoadingNews, refetch: refetchNews } = useQuery({
    queryKey: ['supply-chain-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supply_chain_news')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        content: item.content ? String(item.content).replace(/<\/?[^>]+(>|$)/g, "") : "",
        tags: item.tags || []
      })) as NewsItem[];
    }
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles:author_id(full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(post => ({
        ...post,
        content: post.content ? String(post.content).replace(/<\/?[^>]+(>|$)/g, "") : "",
        tags: post.tags || [],
        author: post.profiles || null
      })) as unknown as BlogPost[];
    }
  });

  const filteredContent = activeTab === "news" 
    ? news?.filter(item =>
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTags.length === 0 || // No tags selected, show all
         (item.tags && selectedTags.some(tag => item.tags?.includes(tag))))
      )
    : blogPosts?.filter(post =>
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTags.length === 0 || // No tags selected, show all
         (post.tags && selectedTags.some(tag => post.tags?.includes(tag))))
      );

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  const getPostImage = (item) => {
    if (activeTab === "news") {
      return item.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80";
    } else {
      return item.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }
    setCreateDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Supply Chain Insights</h1>
        <div className="mt-4 md:mt-0 flex gap-2 items-center">
          {activeTab === "news" && (
            <NewsRefreshButton onRefreshComplete={() => refetchNews()} />
          )}
          {activeTab === "blog" && (
            <Button 
              onClick={handleCreatePost}
              className="flex items-center gap-2"
            >
              <PenSquare className="h-4 w-4" />
              Write Post
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Tabs 
              defaultValue="news" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="news">Global News</TabsTrigger>
                <TabsTrigger value="blog">Community Blog</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex w-full sm:w-auto gap-2">
              <Input
                placeholder={`Search ${activeTab === "news" ? "news" : "blog posts"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60"
              />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter by Tags</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {supplyChainTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tag-${tag}`} 
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => toggleTag(tag)}
                          />
                          <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                        </div>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedTags([])}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {(isLoadingNews || blogLoading) ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredContent?.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No content found</h3>
              <p className="mb-6">Be the first to contribute to our community knowledge base</p>
              {activeTab === "blog" && (
                <Button 
                  onClick={handleCreatePost}
                  className="bg-primary hover:bg-primary/90"
                >
                  Write a Blog Post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredContent?.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <img 
                        src={getPostImage(item)} 
                        alt={item.title}
                        className="h-full w-full object-cover aspect-video md:aspect-square"
                      />
                    </div>
                    <div className="md:col-span-2 p-4">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-2xl">{item.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {formatDate(activeTab === "news" ? item.published_date : item.created_at)}
                          </span>
                          {activeTab === "blog" && (
                            <div className="flex items-center ml-4">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={(item as BlogPost).author?.avatar_url || ''} />
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <span>{(item as BlogPost).author?.full_name || 'Anonymous'}</span>
                            </div>
                          )}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-0 py-2">
                        <p className="text-gray-600 line-clamp-4">{item.content}</p>
                      </CardContent>
                      <CardFooter className="p-0 pt-2 flex justify-between">
                        {activeTab === "news" && (item as NewsItem).source_url && (
                          <a
                            href={(item as NewsItem).source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline mt-4 inline-block"
                          >
                            Read more
                          </a>
                        )}
                        {activeTab === "blog" && (
                          <Button variant="ghost" size="sm" className="ml-auto">
                            Read more
                          </Button>
                        )}
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/4">
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Community Guidelines</h3>
            <ul className="space-y-2 text-sm">
              <li>Be respectful and constructive in your content</li>
              <li>Share your professional experiences and insights</li>
              <li>Cite sources when sharing information</li>
              <li>Avoid self-promotion or spam</li>
              <li>Upload images smaller than 2MB for better performance</li>
            </ul>
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {supplyChainTags.slice(0, 8).map(tag => (
                  <Button 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
