
import { useState } from 'react';
import { JobReferral, ShareTemplate, SuccessStory } from '@/types/sharing';

export const useSharing = () => {
  const [referrals, setReferrals] = useState<JobReferral[]>([]);
  const [templates, setTemplates] = useState<ShareTemplate[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReferral = async (referral: Partial<JobReferral>) => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual Supabase call
      const newReferral = {
        id: Date.now().toString(),
        ...referral,
        created_at: new Date().toISOString(),
        status: 'pending' as const
      } as JobReferral;
      
      setReferrals(prev => [newReferral, ...prev]);
      return newReferral;
    } catch (err) {
      setError('Failed to create referral');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (template: Partial<ShareTemplate>) => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation
      const newTemplate = {
        id: Date.now().toString(),
        ...template,
        created_at: new Date().toISOString()
      } as ShareTemplate;
      
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      setError('Failed to create template');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createStory = async (story: Partial<SuccessStory>) => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation
      const newStory = {
        id: Date.now().toString(),
        ...story,
        created_at: new Date().toISOString()
      } as SuccessStory;
      
      setStories(prev => [newStory, ...prev]);
      return newStory;
    } catch (err) {
      setError('Failed to create story');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    referrals,
    templates,
    stories,
    loading,
    error,
    createReferral,
    createTemplate,
    createStory
  };
};
