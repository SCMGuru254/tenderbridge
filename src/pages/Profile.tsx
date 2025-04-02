
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProfileView from "@/components/ProfileView";
import ProfileEdit from "@/components/ProfileEdit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { PencilIcon } from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("view");

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view profiles",
            variant: "destructive",
          });
          return;
        }

        setUserId(user.id);
        
        // If no ID is provided in URL, use current user's ID
        const profileId = id || user.id;
        
        // Check if viewing own profile
        if (user.id === profileId) {
          setIsCurrentUser(true);
        }
        
      } catch (error) {
        console.error("Error checking user:", error);
        toast({
          title: "Error",
          description: "Failed to load user information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCurrentUser();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!userId) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please sign in to view profiles.
        </AlertDescription>
      </Alert>
    );
  }
  
  const profileId = id || userId;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {isCurrentUser ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Profile</h1>
            <TabsList>
              <TabsTrigger value="view">View Profile</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="view">
            <ProfileView />
          </TabsContent>
          
          <TabsContent value="edit">
            <ProfileEdit />
          </TabsContent>
        </Tabs>
      ) : (
        <ProfileView />
      )}
    </div>
  );
}
