
import { useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileAboutTab } from '@/components/profile/ProfileAboutTab';
import { ProfileViewsTab } from '@/components/profile/ProfileViewsTab';
import { HiringDecisionsTab } from '@/components/profile/HiringDecisionsTab';
import { RecordDecisionTab } from '@/components/profile/RecordDecisionTab';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ProfileView, HiringDecision } from '@/types/profiles';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    id: user?.id || '',
    email: user?.email || '',
    full_name: user?.user_metadata?.full_name || 'User Name',
    avatar_url: null,
    company: null,
    position: null,
    bio: null,
    linkedin_url: null,
    cv_url: null,
    cv_filename: null,
    role: 'job_seeker',
    notify_on_view: true,
    visibility: 'private',
    visible_fields: ['full_name', 'position', 'company'],
    allowed_roles: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const [profileViews] = useState<ProfileView[]>([]);
  const [hiringDecisions] = useState<HiringDecision[]>([]);

  const handleRecordDecision = (decision: any) => {
    console.log('Recording decision:', decision);
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile);
  };

  return (
    <div className="container mx-auto p-6">
      <ProfileHeader profile={profile} onProfileUpdate={handleProfileUpdate} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="w-full flex justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="about" className="flex-1 min-w-[100px]">About</TabsTrigger>
          <TabsTrigger value="privacy" className="flex-1 min-w-[100px]">Privacy</TabsTrigger>
          <TabsTrigger value="views" className="flex-1 min-w-[100px]">Profile Views</TabsTrigger>
          <TabsTrigger value="decisions" className="flex-1 min-w-[120px]">Hiring Decisions</TabsTrigger>
          <TabsTrigger value="record" className="flex-1 min-w-[120px]">Record Decision</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-6">
          <ProfileAboutTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="views" className="mt-6">
          <ProfileViewsTab profileViews={profileViews} />
        </TabsContent>
        
        <TabsContent value="decisions" className="mt-6">
          <HiringDecisionsTab hiringDecisions={hiringDecisions} />
        </TabsContent>
        
        <TabsContent value="record" className="mt-6">
          <RecordDecisionTab profile={profile} onRecordDecision={handleRecordDecision} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
