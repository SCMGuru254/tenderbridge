
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO, isAfter, subDays } from "date-fns";
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
  } | null;
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

  const { data: blogPostsData = [], isLoading: blogLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      // First fetch basic blog post data
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process each blog post to add author info
      const blogPosts: BlogPost[] = await Promise.all(
        data.map(async (post) => {
          // Get author info separately
          const { data: authorData, error: authorError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', post.author_id)
            .single();
          
          return {
            ...post,
            content: post.content ? String(post.content).replace(/<\/?[^>]+(>|$)/g, "") : "",
            tags: post.tags || [],
            author: authorError ? null : authorData
          };
        })
      );
      
      return blogPosts;
    }
  });

  // Calculate date 3 days ago for filtering
  const threeDaysAgo = subDays(new Date(), 3);

  const filteredContent = activeTab === "news" 
    ? news?.filter(item => {
        // Check if the item matches the search term and tags
        const matchesSearch = !searchTerm || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesTags = selectedTags.length === 0 || 
          (item.tags && selectedTags.some(tag => item.tags?.includes(tag)));
        
        // Check if the item is from the last 3 days
        let isRecent = true;
        if (item.published_date) {
          try {
            const pubDate = parseISO(item.published_date);
            isRecent = isAfter(pubDate, threeDaysAgo);
          } catch (e) {
            // If date parsing fails, include the item
            console.error("Error parsing date:", e);
          }
        }
        
        return matchesSearch && matchesTags && isRecent;
      })
    : blogPostsData?.filter(post =>
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTags.length === 0 || 
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
