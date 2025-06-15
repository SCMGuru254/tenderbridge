
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users } from 'lucide-react';
import { EnhancedProfileCard } from './EnhancedProfileCard';
import { Profile } from '@/types/profiles';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { followUser, unfollowUser, getFollowing, getFollowers } from '@/services/followService';
import { toast } from 'sonner';

export const CandidateFollowList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfiles();
      fetchFollowingData();
      fetchFollowersData();
    }
  }, [user]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingData = async () => {
    if (!user) return;
    
    try {
      const followingData = await getFollowing(user.id);
      setFollowing(followingData.map(f => f.following_id));
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const fetchFollowersData = async () => {
    if (!user) return;
    
    try {
      const followersData = await getFollowers(user.id);
      const followerIds = followersData.map(f => f.follower_id);
      
      if (followerIds.length > 0) {
        const { data: followerProfiles, error } = await supabase
          .from('profiles')
          .select('*')
          .in('id', followerIds);

        if (error) throw error;
        setFollowers(followerProfiles || []);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const handleFollow = async (profileId: string) => {
    if (!user) return;

    try {
      const isCurrentlyFollowing = following.includes(profileId);
      
      if (isCurrentlyFollowing) {
        await unfollowUser(profileId);
        setFollowing(following.filter(id => id !== profileId));
        toast.success('Unfollowed successfully');
      } else {
        await followUser(profileId);
        setFollowing([...following, profileId]);
        toast.success('Following successfully');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleMessage = (profile: Profile) => {
    toast.info(`Messaging feature coming soon for ${profile.full_name}`);
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading professionals...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Professional Network
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search professionals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="discover">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="following">Following ({following.length})</TabsTrigger>
            <TabsTrigger value="followers">Followers ({followers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProfiles.map((profile) => (
                <EnhancedProfileCard
                  key={profile.id}
                  profile={profile}
                  isFollowing={following.includes(profile.id)}
                  onFollow={() => handleFollow(profile.id)}
                  onMessage={() => handleMessage(profile)}
                />
              ))}
            </div>
            {filteredProfiles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No professionals found matching your search
              </div>
            )}
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles
                .filter(profile => following.includes(profile.id))
                .map((profile) => (
                  <EnhancedProfileCard
                    key={profile.id}
                    profile={profile}
                    isFollowing={true}
                    onFollow={() => handleFollow(profile.id)}
                    onMessage={() => handleMessage(profile)}
                  />
                ))}
            </div>
            {following.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                You're not following anyone yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followers.map((profile) => (
                <EnhancedProfileCard
                  key={profile.id}
                  profile={profile}
                  showActions={false}
                />
              ))}
            </div>
            {followers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No followers yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
