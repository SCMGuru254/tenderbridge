
import { useState } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileAboutTab } from '@/components/profile/ProfileAboutTab';
import { ProfileViewsTab } from '@/components/profile/ProfileViewsTab';
import { HiringDecisionsTab } from '@/components/profile/HiringDecisionsTab';
import { RecordDecisionTab } from '@/components/profile/RecordDecisionTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="container mx-auto p-6">
      <ProfileHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="views">Profile Views</TabsTrigger>
          <TabsTrigger value="decisions">Hiring Decisions</TabsTrigger>
          <TabsTrigger value="record">Record Decision</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-6">
          <ProfileAboutTab />
        </TabsContent>
        
        <TabsContent value="views" className="mt-6">
          <ProfileViewsTab />
        </TabsContent>
        
        <TabsContent value="decisions" className="mt-6">
          <HiringDecisionsTab />
        </TabsContent>
        
        <TabsContent value="record" className="mt-6">
          <RecordDecisionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
