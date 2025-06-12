import { supabase } from '@/integrations/supabase/client';
import { cache } from '@/utils/cache';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performance';
import { errorHandler } from '@/utils/errorHandling';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  job_categories?: string[];
  preferred_locations?: string[];
  job_types?: string[];
  experience_level?: string;
  salary_range?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
    job_alerts: boolean;
    application_updates: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export class UserService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      performanceMonitor.startMeasure('fetch-profile');
      
      const cacheKey = `profile-${userId}`;
      const cachedProfile = cache.get<UserProfile>(cacheKey);
      if (cachedProfile) {
        analytics.trackUserAction('profile-cache-hit');
        return cachedProfile;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        cache.set(cacheKey, data, { ttl: this.CACHE_TTL });
        analytics.trackUserAction('profile-fetch-success');
      }
      
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'NETWORK');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('fetch-profile');
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      performanceMonitor.startMeasure('update-profile');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache
      cache.delete(`profile-${userId}`);
      analytics.trackUserAction('profile-update-success');
      
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('update-profile');
    }
  }

  async getPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      performanceMonitor.startMeasure('fetch-preferences');
      
      const cacheKey = `preferences-${userId}`;
      const cachedPreferences = cache.get<UserPreferences>(cacheKey);
      if (cachedPreferences) {
        analytics.trackUserAction('preferences-cache-hit');
        return cachedPreferences;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        cache.set(cacheKey, data, { ttl: this.CACHE_TTL });
        analytics.trackUserAction('preferences-fetch-success');
      }
      
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'NETWORK');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('fetch-preferences');
    }
  }

  async updatePreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
    try {
      performanceMonitor.startMeasure('update-preferences');

      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache
      cache.delete(`preferences-${userId}`);
      analytics.trackUserAction('preferences-update-success');
      
      return data;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('update-preferences');
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      performanceMonitor.startMeasure('upload-avatar');

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await this.updateProfile(userId, { avatar_url: publicUrl });
      analytics.trackUserAction('avatar-upload-success');
      
      return publicUrl;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return null;
    } finally {
      performanceMonitor.endMeasure('upload-avatar');
    }
  }

  async deleteAccount(userId: string): Promise<boolean> {
    try {
      performanceMonitor.startMeasure('delete-account');

      // Delete user data from all related tables
      const tables = ['profiles', 'user_preferences', 'job_applications', 'job_alerts', 'notifications'];
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
      }

      // Delete user's avatar if exists
      const profile = await this.getProfile(userId);
      if (profile?.avatar_url) {
        const fileName = profile.avatar_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('avatars')
            .remove([fileName]);
        }
      }

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      // Clear all user-related caches
      cache.delete(`profile-${userId}`);
      cache.delete(`preferences-${userId}`);
      cache.delete(`applications-${userId}`);
      cache.delete(`alerts-${userId}`);
      cache.delete(`notifications-${userId}`);
      
      analytics.trackUserAction('account-delete-success');
      return true;
    } catch (error) {
      errorHandler.handleError(error, 'SERVER');
      analytics.trackError(error as Error);
      return false;
    } finally {
      performanceMonitor.endMeasure('delete-account');
    }
  }
}

export const userService = new UserService(); 