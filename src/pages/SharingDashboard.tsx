
import { ReferralForm } from "@/components/sharing/ReferralForm";
import { ShareTemplateManager } from "@/components/sharing/ShareTemplateManager";
import { SuccessStories } from "@/components/sharing/SuccessStories";
import { useSharing } from "../hooks/useSharing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SharingDashboard() {
  const { referrals, templates, stories } = useSharing();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sharing Dashboard</h1>
        
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Referrals Sent</CardTitle>
              <CardDescription>Total job referrals you've sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referrals.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Templates Created</CardTitle>
              <CardDescription>Reusable sharing templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Success Stories</CardTitle>
              <CardDescription>Stories you've shared</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stories.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="referrals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="referrals">
            <ReferralForm />
          </TabsContent>
          
          <TabsContent value="templates">
            <ShareTemplateManager />
          </TabsContent>
          
          <TabsContent value="stories">
            <SuccessStories />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
