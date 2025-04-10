
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Briefcase, Calendar, Download, User, File, Linkedin, Mail, Eye, CheckCircle } from "lucide-react";
import { Profile, ProfileView, HiringDecision } from "@/types/profiles";
import { useUser } from "@/hooks/useUser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ProfileViewComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileViews, setProfileViews] = useState<ProfileView[]>([]);
  const [hiringDecisions, setHiringDecisions] = useState<HiringDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [decisionDate, setDecisionDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch the profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();
          
        if (profileError) throw profileError;
        
        setProfile(profileData);
        
        // Record a profile view if the viewer is not the profile owner
        if (user && user.id !== id) {
          // Use RPC to call the record_profile_view function
          const { error: viewError } = await supabase.rpc(
            "record_profile_view",
            { 
              profile_id_param: id, 
              viewer_id_param: user.id 
            }
          );
          
          if (viewError) {
            console.error("Error recording profile view:", viewError);
          }
        }
        
        // Fetch profile views if the user is the profile owner
        if (user && user.id === id) {
          // Use RPC to call the get_profile_views function with the correct type
          const { data: viewsData, error: viewsError } = await supabase.rpc<ProfileView[]>(
            "get_profile_views",
            { 
              profile_id_param: id 
            }
          );
          
          if (viewsError) {
            console.error("Error fetching profile views:", viewsError);
          } else {
            setProfileViews(viewsData || []);
          }
          
          // Fetch hiring decisions for this candidate with the correct type
          const { data: decisionsData, error: decisionsError } = await supabase.rpc<HiringDecision[]>(
            "get_hiring_decisions",
            { 
              candidate_id_param: id 
            }
          );
          
          if (decisionsError) {
            console.error("Error fetching hiring decisions:", decisionsError);
          } else {
            setHiringDecisions(decisionsData || []);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user, toast]);

  const handleRecordDecision = async () => {
    if (!user || !profile) return;
    
    try {
      // Use RPC to call the record_hiring_decision function
      const { error } = await supabase.rpc(
        "record_hiring_decision",
        { 
          employer_id_param: user.id,
          candidate_id_param: profile.id,
          decision_date_param: decisionDate,
          notes_param: notes
        }
      );
      
      if (error) throw error;
      
      toast({
        title: "Decision recorded",
        description: "Your hiring decision has been recorded and the candidate will be notified.",
      });
      
      // Refresh hiring decisions list
      const { data: updatedDecisions, error: fetchError } = await supabase.rpc<HiringDecision[]>(
        "get_hiring_decisions",
        { 
          candidate_id_param: profile.id 
        }
      );
      
      if (!fetchError && updatedDecisions) {
        setHiringDecisions(updatedDecisions);
      }
      
      // Reset form
      setNotes("");
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
        <Button className="mt-4" onClick={() => navigate("/jobs")}>
          Go to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in">
      <Card className="mb-8">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Avatar className="h-20 w-20">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {profile.full_name ? profile.full_name[0].toUpperCase() : <User />}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.full_name || "Unnamed User"}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                {profile.position && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> {profile.position}
                  </span>
                )}
                {profile.company && (
                  <span className="flex items-center gap-1">
                    at {profile.company}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {profile.cv_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.cv_url} target="_blank" rel="noreferrer" download>
                  <Download className="h-4 w-4 mr-1" /> Download CV
                </a>
              </Button>
            )}
            {profile.linkedin_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4 mr-1" /> LinkedIn
                </a>
              </Button>
            )}
            {profile.email && user && user.id !== profile.id && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/messages?to=${profile.id}`)}>
                <Mail className="h-4 w-4 mr-1" /> Message
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              {user && user.id === profile.id && (
                <>
                  <TabsTrigger value="profile-views">Profile Views</TabsTrigger>
                  <TabsTrigger value="hiring-decisions">Hiring Decisions</TabsTrigger>
                </>
              )}
              {user && user.id !== profile.id && user.id && (
                <TabsTrigger value="record-decision">Record Decision</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <div className="space-y-4">
                {profile.bio && (
                  <div>
                    <h3 className="font-medium mb-2">Bio</h3>
                    <p className="text-sm text-gray-600">{profile.bio}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.email && (
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {profile.email}
                      </p>
                    </div>
                  )}
                  {profile.role && (
                    <div>
                      <h3 className="font-medium mb-1">Role</h3>
                      <p className="text-sm text-gray-600 capitalize">{profile.role.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {user && user.id === profile.id && (
              <TabsContent value="profile-views" className="mt-4">
                <h3 className="font-medium mb-4">People who viewed your profile</h3>
                {profileViews.length === 0 ? (
                  <p className="text-sm text-gray-500">No one has viewed your profile yet.</p>
                ) : (
                  <div className="space-y-4">
                    {profileViews.map((view) => (
                      <Card key={view.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {view.viewer.avatar_url ? (
                                <AvatarImage src={view.viewer.avatar_url} alt={view.viewer.full_name || "Viewer"} />
                              ) : (
                                <AvatarFallback>
                                  {view.viewer.full_name ? view.viewer.full_name[0].toUpperCase() : <User />}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{view.viewer.full_name}</div>
                              {view.viewer.company && (
                                <div className="text-sm text-gray-500">{view.viewer.company}</div>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {format(new Date(view.viewed_at), "MMM d, yyyy")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
            
            {user && user.id === profile.id && (
              <TabsContent value="hiring-decisions" className="mt-4">
                <h3 className="font-medium mb-4">Hiring Decisions</h3>
                {hiringDecisions.length === 0 ? (
                  <p className="text-sm text-gray-500">No hiring decisions have been recorded for you yet.</p>
                ) : (
                  <div className="space-y-4">
                    {hiringDecisions.map((decision) => (
                      <Card key={decision.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {decision.employer.avatar_url ? (
                                <AvatarImage src={decision.employer.avatar_url} alt={decision.employer.full_name || "Employer"} />
                              ) : (
                                <AvatarFallback>
                                  {decision.employer.full_name ? decision.employer.full_name[0].toUpperCase() : <User />}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{decision.employer.full_name}</div>
                              {decision.employer.company && (
                                <div className="text-sm text-gray-500">{decision.employer.company}</div>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(decision.decision_date), "MMM d, yyyy")}
                            </div>
                          </div>
                          {decision.notes && (
                            <div className="mt-3 text-sm p-3 bg-secondary/10 rounded-md">
                              {decision.notes}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
            
            {user && user.id !== profile.id && (
              <TabsContent value="record-decision" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="decision-date">Decision Date</Label>
                    <Input
                      id="decision-date"
                      type="date"
                      value={decisionDate}
                      onChange={(e) => setDecisionDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any comments or notes about your decision..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleRecordDecision} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" /> Record Decision
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileViewComponent;
