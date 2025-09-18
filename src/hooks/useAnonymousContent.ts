import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';

interface AnonymousPostOptions {
  table: string;
  data: Record<string, any>;
}

interface AnonymousContentOptions {
  anonymousAllowed?: boolean;
  defaultAnonymous?: boolean;
}

export const useAnonymousContent = (options: AnonymousContentOptions = {}) => {
  const { anonymousAllowed = true, defaultAnonymous = false } = options;
  const [isAnonymous, setIsAnonymous] = useState(defaultAnonymous);
  const { user } = useAuth();

  const toggleAnonymous = () => {
    if (anonymousAllowed) {
      setIsAnonymous(!isAnonymous);
    }
  };

  const postAnonymously = async ({ table, data }: AnonymousPostOptions) => {
    try {
      if (!user) throw new Error('User must be authenticated to post');

      const postData = {
        ...data,
        user_id: user.id,
        anonymous: isAnonymous,
        // If posting anonymously, remove or mask any identifying information
        ...(isAnonymous && {
          author_name: undefined,
          author_email: undefined,
          author_avatar: undefined
        })
      };

      const { data: result, error } = await supabase
        .from(table)
        .insert(postData)
        .select()
        .single();

      if (error) throw error;

      return { data: result, error: null };
    } catch (error) {
      console.error('Error posting anonymously:', error);
      return { data: null, error };
    }
  };

  return {
    isAnonymous,
    setIsAnonymous,
    toggleAnonymous,
    postAnonymously,
    anonymousAllowed
  };
};