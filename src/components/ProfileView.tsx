
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Profile, ProfileView, HiringDecision } from "@/types/profiles";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  fetchProfile, 
  recordProfileView, 
  getProfileViews, 
  getHiringDecisions,
  recordHiringDecision 
} from "@/services/profileService";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileAboutTab from "./profile/ProfileAboutTab";
import ProfileViewsTab from "./profile/ProfileViewsTab";
import HiringDecisionsTab from "./profile/HiringDecisionsTab";
import RecordDecisionTab from "./profile/RecordDecisionTab";

const ProfileViewComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileViews, setProfileViews] = useState<ProfileView[]>([]);
  const [hiringDecisions, setHiringDecisions] = useState<HiringDecision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const loadProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileData = await fetchProfile(id);
        setProfile(profileData);
        
        // Record profile view if viewing someone else's profile
        if (user && user.id !== id) {
          try {
            await recordProfileView({ 
              profile_id_param: id, 
              viewer_id_param: user.id 
            });
          } catch (viewError) {
            console.error("Error recording profile view:", viewError);
          }
        }
        
        // Fetch profile views and hiring decisions if viewing own profile
        if (user && user.id === id) {
          try {
            const viewsData = await getProfileViews({ profile_id_param: id });
            setProfileViews(viewsData);
          } catch (viewsError) {
            console.error("Error fetching profile views:", viewsError);
          }
          
          try {
            const decisionsData = await getHiringDecisions({ candidate_id_param: id });
            setHiringDecisions(decisionsData);
          } catch (decisionsError) {
            console.error("Error fetching hiring decisions:", decisionsError);
          }
        }
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [id, user, toast]);

  const handleRecordDecision = async (decisionDate: string, notes: string) => {
    if (!user || !profile) return;
    
    try {
      await recordHiringDecision({
        employer_id_param: user.id,
        candidate_id_param: profile.id,
        decision_date_param: decisionDate,
        notes_param: notes
      });
      
      toast({
        title: "Decision recorded",
        description: "Your hiring decision has been recorded and the candidate will be notified.",
      });
      
      // Refresh hiring decisions if viewing own profile
      if (user.id === profile.id) {
        try {
          const updatedDecisions = await getHiringDecisions({ candidate_id_param: profile.id });
          setHiringDecisions(updatedDecisions);
        } catch (error) {
          console.error("Error refreshing hiring decisions:", error);
        }
      }
    } catch (error) {
      console.error("Error recording decision:", error);
      toast({
        title: "Error",
        description: "Failed to record your decision",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <p className="mt-4">The profile you are looking for does not exist or has been removed.</p>
        <button className="mt-4" onClick={() => navigate("/jobs")}>
          Go to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in">
      <Card className="mb-8">
        <CardHeader>
          <ProfileHeader profile={profile} currentUserId={user?.id || null} />
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              {user && user.id === profile?.id && (
                <>
                  <TabsTrigger value="profile-views">Profile Views</TabsTrigger>
                  <TabsTrigger value="hiring-decisions">Hiring Decisions</TabsTrigger>
                </>
              )}
              {user && user.id !== profile?.id && user.id && (
                <TabsTrigger value="record-decision">Record Decision</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <ProfileAboutTab profile={profile} />
            </TabsContent>
            
            {user && user.id === profile?.id && (
              <TabsContent value="profile-views" className="mt-4">
                <ProfileViewsTab profileViews={profileViews} />
              </TabsContent>
            )}
            
            {user && user.id === profile?.id && (
              <TabsContent value="hiring-decisions" className="mt-4">
                <HiringDecisionsTab hiringDecisions={hiringDecisions} />
              </TabsContent>
            )}
            
            {user && user.id !== profile?.id && (
              <TabsContent value="record-decision" className="mt-4">
                <RecordDecisionTab 
                  profile={profile} 
                  onRecordDecision={handleRecordDecision} 
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileViewComponent;
