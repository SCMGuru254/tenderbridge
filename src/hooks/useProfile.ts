import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, UserRole } from '@/types/database';

interface UseProfileOptions {
  includeRoles?: boolean;
}

interface ProfileData {
  profile: Profile | null;
  roles: UserRole[];
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updateRoles: (roles: string[]) => Promise<void>;
}

export const useProfile = (userId?: string, options: UseProfileOptions = {}): ProfileData => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch roles if requested
        if (options.includeRoles) {
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', targetUserId);

          if (rolesError) throw rolesError;
          setRoles(rolesData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId, options.includeRoles]);

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!targetUserId) throw new Error('No user ID provided');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', targetUserId);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err instanceof Error ? err : new Error('Failed to update profile');
    }
  };

  const updateRoles = async (newRoles: string[]) => {
    try {
      if (!targetUserId) throw new Error('No user ID provided');

      // Delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', targetUserId);

      if (deleteError) throw deleteError;

      // Insert new roles
      if (newRoles.length > 0) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(
            newRoles.map(role => ({
              user_id: targetUserId,
              role
            }))
          );

        if (insertError) throw insertError;
      }

      // Refresh roles
      const { data: updatedRoles, error: fetchError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', targetUserId);

      if (fetchError) throw fetchError;
      setRoles(updatedRoles);
    } catch (err) {
      console.error('Error updating roles:', err);
      throw err instanceof Error ? err : new Error('Failed to update roles');
    }
  };

  return {
    profile,
    roles,
    isLoading,
    error,
    updateProfile,
    updateRoles
  };
};