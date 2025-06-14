
import { useState } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileAboutTab } from '@/components/profile/ProfileAboutTab';
import { ProfileViewsTab } from '@/components/profile/ProfileViewsTab';
import { HiringDecisionsTab } from '@/components/profile/HiringDecisionsTab';
import { RecordDecisionTab } from '@/components/profile/RecordDecisionTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import type { ProfileView, HiringDecision } from '@/types/profiles';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const { user } = useAuth();

  // Mock profile data - would come from actual data source
  const profile = {
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const profileViews: ProfileView[] = [];
  const hiringDecisions: HiringDecision[] = [];

  const handleRecordDecision = (decision: any) => {
    console.log('Recording decision:', decision);
  };

  return (
    <div className="container mx-auto p-6">
      <ProfileHeader profile={profile} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="views">Profile Views</TabsTrigger>
          <TabsTrigger value="decisions">Hiring Decisions</TabsTrigger>
          <TabsTrigger value="record">Record Decision</TabsTrigger>
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
