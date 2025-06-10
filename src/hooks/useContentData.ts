
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'blog' | 'news';
  tags: string[];
  created_at: string;
  author?: string;
}

export const useContentData = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: blogPosts } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: newsItems } = await supabase
          .from('news_items')
          .select('*')
          .order('created_at', { ascending: false });

        const formattedContent: ContentItem[] = [
          ...(blogPosts || []).map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            type: 'blog' as const,
            tags: post.tags || [],
            created_at: post.created_at,
            author: post.author
          })),
          ...(newsItems || []).map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            type: 'news' as const,
            tags: item.tags || [],
            created_at: item.created_at
          }))
        ];

        setContent(formattedContent);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading };
};
