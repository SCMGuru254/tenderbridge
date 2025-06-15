
import { supabase } from "@/integrations/supabase/client";
import { Follow } from "@/types/profiles";

export const followUser = async (followingId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: followingId
    });

  if (error) throw error;
};

export const unfollowUser = async (followingId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', followingId);

  if (error) throw error;
};

export const getFollowing = async (userId: string): Promise<Follow[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', userId);

  if (error) throw error;
  return data || [];
};

export const getFollowers = async (userId: string): Promise<Follow[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('following_id', userId);

  if (error) throw error;
  return data || [];
};

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};
