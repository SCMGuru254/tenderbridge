import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'review' | 'discussion' | 'comment' | 'application';
import {
  generateAnonymousId,
  generateAnonymousName,
  checkRateLimit,
  sanitizeAnonymousContent,
  validateAnonymousContent
} from '@/utils/anonymousUtils';

export const useAnonymous = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousName, setAnonymousName] = useState('');
  const [anonymousId, setAnonymousId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load anonymous settings
  useEffect(() => {
    loadAnonymousSettings();
  }, []);

  const loadAnonymousSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { data: settings, error } = await supabase
        .from('anonymous_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (settings) {
        setIsAnonymous(settings.default_anonymous);
        setAnonymousName(settings.preferred_anonymous_name || '');
        setAnonymousId(settings.id);
      } else {
        // Create new anonymous settings
        const newSettings = {
          user_id: user.id,
          default_anonymous: false,
          preferred_anonymous_name: generateAnonymousName(),
          anonymous_identifier: generateAnonymousId()
        };

        const { data, error: insertError } = await supabase
          .from('anonymous_settings')
          .insert([newSettings])
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          setIsAnonymous(data.default_anonymous);
          setAnonymousName(data.preferred_anonymous_name || '');
          setAnonymousId(data.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load anonymous settings');
    } finally {
      setLoading(false);
    }
  };

  // Update anonymous settings with rate limiting
  const updateAnonymousSettings = useCallback(async (
    defaultAnonymous: boolean,
    preferredName: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check rate limit (max 5 updates per minute)
      const canUpdate = await checkRateLimit(`anonymous_settings_${user.id}`, {
        key: 'update_settings',
        points: 5,
        duration: 60
      });

      if (!canUpdate) {
        throw new Error('Too many updates. Please wait a minute.');
      }

      const { error } = await supabase
        .from('anonymous_settings')
        .upsert({
          user_id: user.id,
          default_anonymous: defaultAnonymous,
          preferred_anonymous_name: preferredName,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsAnonymous(defaultAnonymous);
      setAnonymousName(preferredName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update anonymous settings');
      throw err;
    }
  }, []);

  // Post content anonymously with content validation
  const postAnonymously = useCallback(async (
    content: string,
    type: 'review' | 'comment' | 'discussion'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate content
      if (!validateAnonymousContent(content)) {
        throw new Error('Content contains sensitive information');
      }

      // Sanitize content
      const sanitizedContent = sanitizeAnonymousContent(content);

      // Check rate limit (max 3 posts per minute)
      const canPost = await checkRateLimit(`anonymous_post_${user.id}`, {
        key: 'create_post',
        points: 3,
        duration: 60
      });

      if (!canPost) {
        throw new Error('Too many posts. Please wait a minute.');
      }

      const postData = {
        content: sanitizedContent,
        user_id: user.id,
        is_anonymous: true,
        anonymous_display_name: anonymousName || generateAnonymousName(),
        anonymous_identifier: anonymousId || generateAnonymousId(),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from(type === 'review' ? 'company_reviews' : 
              type === 'comment' ? 'discussion_comments' : 
              'discussions')
        .insert([postData]);

      if (error) throw error;

      return postData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post content');
      throw err;
    }
  }, [anonymousName, anonymousId]);

  return {
    isAnonymous,
    anonymousName,
    anonymousId,
    loading,
    error,
    setIsAnonymous,
    setAnonymousName,
    updateAnonymousSettings,
    postAnonymously
  };
};