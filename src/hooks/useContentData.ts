
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isAfter, subDays } from "date-fns";

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

export const useContentData = (activeTab: string) => {
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
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15
  });

  const { data: blogPostsData = [], isLoading: blogLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const blogPosts: BlogPost[] = await Promise.all(
        data.map(async (post) => {
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

  return {
    news,
    blogPostsData,
    isLoadingNews,
    blogLoading
  };
};

export type { NewsItem, BlogPost };
