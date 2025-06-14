
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { rateLimiter } from "@/utils/rateLimiter";

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class UserService {
  // Get user profile with caching
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  // Update user profile
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    const rateCheck = await rateLimiter.checkLimit('profile_update', userId);
    if (!rateCheck.success) {
      throw new Error('Too many profile updates. Please wait before trying again.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  }

  // Create user profile
  async createProfile(userId: string, profileData: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return data;
  }

  // Get user preferences
  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user preferences:', error);
      return null;
    }

    return data;
  }

  // Update user preferences
  async updateUserPreferences(userId: string, preferences: any) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }

    return data;
  }

  // Get user analytics
  async getUserAnalytics(userId: string) {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching user analytics:', error);
      return [];
    }

    return data;
  }

  // Track user activity
  async trackActivity(userId: string, activity: {
    action: string;
    resource_type?: string;
    resource_id?: string;
    metadata?: any;
  }) {
    const rateCheck = await rateLimiter.checkLimit('track_activity', userId);
    if (!rateCheck.success) {
      return; // Silently fail for activity tracking
    }

    const { error } = await supabase
      .from('user_analytics')
      .insert({
        user_id: userId,
        action: activity.action,
        resource_type: activity.resource_type,
        resource_id: activity.resource_id,
        metadata: activity.metadata
      });

    if (error) {
      console.error('Error tracking user activity:', error);
    }
  }

  // Get user connections
  async getUserConnections(userId: string) {
    const { data, error } = await supabase
      .from('user_connections')
      .select(`
        *,
        connected_user:profiles!user_connections_connected_user_id_fkey(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching user connections:', error);
      return [];
    }

    return data;
  }

  // Send connection request
  async sendConnectionRequest(fromUserId: string, toUserId: string, message?: string) {
    const rateCheck = await rateLimiter.checkLimit('connection_request', fromUserId);
    if (!rateCheck.success) {
      throw new Error('Too many connection requests. Please wait before sending more.');
    }

    const { data, error } = await supabase
      .from('user_connections')
      .insert({
        user_id: fromUserId,
        connected_user_id: toUserId,
        status: 'pending',
        message
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }

    return data;
  }

  // Accept connection request
  async acceptConnectionRequest(connectionId: string) {
    const { data, error } = await supabase
      .from('user_connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId)
      .select()
      .single();

    if (error) {
      console.error('Error accepting connection request:', error);
      throw error;
    }

    return data;
  }

  // Upload profile picture
  async uploadProfilePicture(userId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}

export const userService = new UserService();
