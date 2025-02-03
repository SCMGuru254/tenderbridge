import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("news");

  const { data: news, isLoading: isLoadingNews } = useQuery({
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

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Supply Chain Insights</h1>

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
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {format(
                      new Date(activeTab === "news" ? item.published_date : item.created_at),
                      'MMMM d, yyyy'
                    )}
                  </span>
                  {activeTab === "blog" && (
                    <>
                      <span className="mx-2">•</span>
                      <span>By {item.author?.full_name || 'Anonymous'}</span>
                    </>
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;