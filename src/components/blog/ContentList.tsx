
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { BlogNewsItem } from "./BlogNewsItem";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source_name?: string;
  source_url?: string;
  published_date?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  image_url?: string;
}

interface BlogPost extends NewsItem {
  author_id: string;
  author?: {
    full_name: string;
    avatar_url: string;
  };
}

interface ContentListProps {
  activeTab: string;
  searchTerm: string;
  selectedTags: string[];
  handleCreatePost: () => void;
}

export const ContentList = ({ activeTab, searchTerm, selectedTags, handleCreatePost }: ContentListProps) => {
  const { data: news, isLoading: isLoadingNews } = useQuery({
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
        .select('*, author:author_id(full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(post => ({
        ...post,
        content: post.content ? String(post.content).replace(/<\/?[^>]+(>|$)/g, "") : "",
        tags: post.tags || [],
        author: post.author || null
      })) as BlogPost[];
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

  if (isLoadingNews || blogLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (filteredContent?.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid gap-6">
      {filteredContent?.map((item) => (
        <BlogNewsItem 
          key={item.id}
          item={item}
          type={activeTab as "news" | "blog"}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};
