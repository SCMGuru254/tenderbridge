import { useUser } from '@/hooks/useUser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserCog } from 'lucide-react';
import ConnectionsManager from '@/components/networking/ConnectionsManager';
import ConnectionSuggestions from '@/components/networking/ConnectionSuggestions';
import SkillEndorsements from '@/components/networking/SkillEndorsements';
import Recommendations from '@/components/networking/Recommendations';

export default function NetworkingPage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <UserCog className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to access your professional network.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <ConnectionSuggestions />

          <Tabs defaultValue="connections">
            <TabsList>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="endorsements">Skill Endorsements</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="connections" className="mt-6">
              <ConnectionsManager />
            </TabsContent>

            <TabsContent value="endorsements" className="mt-6">
              <SkillEndorsements />
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              <Recommendations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
