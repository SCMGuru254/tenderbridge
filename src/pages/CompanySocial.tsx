
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyUpdates } from "@/components/company/CompanyUpdates";
import { CompanyEvents } from "@/components/company/CompanyEvents";
import { CompanyTeam } from "@/components/company/CompanyTeam";

export default function CompanySocial() {
  const [updates] = useState([]);
  const [events] = useState([]);
  const [team] = useState([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Company Social Hub</h1>
        
        <Tabs defaultValue="updates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle>Company Updates</CardTitle>
                <CardDescription>Latest news and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyUpdates updates={updates} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Company Events</CardTitle>
                <CardDescription>Upcoming events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyEvents events={events} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Meet the team</CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyTeam members={team} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
