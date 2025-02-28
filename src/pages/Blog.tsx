
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewsRefreshButton } from "@/components/NewsRefreshButton";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("news");

  const { data: news, isLoading: isLoadingNews, refetch: refetchNews } = useQuery({
    queryKey: ['supply-chain-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supply_chain_news')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, author:profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const filteredContent = activeTab === "news" 
    ? news?.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts?.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      // Parse the ISO string
      const date = parseISO(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  // Helper to get post image (placeholder if none exists)
  const getPostImage = (item) => {
    if (activeTab === "news") {
      return item.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80";
    } else {
      return item.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Supply Chain Insights</h1>
        {activeTab === "news" && (
          <div className="mt-4 md:mt-0">
            <NewsRefreshButton onRefreshComplete={() => refetchNews()} />
          </div>
        )}
      </div>

      <Tabs defaultValue="news" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news">Global News</TabsTrigger>
          <TabsTrigger value="blog">Community Blog</TabsTrigger>
        </TabsList>
      </Tabs>

      <Input
        placeholder={`Search ${activeTab === "news" ? "news" : "blog posts"}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8"
      />

      {(isLoadingNews || isLoadingPosts) ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : filteredContent?.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No content found
        </div>
      ) : (
        <div className="grid gap-8 animate-fade-in">
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
                <div className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {formatDate(activeTab === "news" ? item.published_date : item.created_at)}
                      </span>
                      {activeTab === "blog" && item.author && (
                        <div className="flex items-center ml-4">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={item.author?.avatar_url} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.author?.full_name || 'Anonymous'}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-4">{item.content}</p>
                    {activeTab === "news" && item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-4 inline-block"
                      >
                        Read more
                      </a>
                    )}
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
