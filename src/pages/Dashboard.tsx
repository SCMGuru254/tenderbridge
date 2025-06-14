import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarkIcon, BriefcaseIcon, UserIcon, TrendingUpIcon, Sparkles, Share2, Users } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AIJobRecommendations } from "@/components/ai/AIJobRecommendations";
import { SocialShareHub } from "@/components/social/SocialShareHub";
import { SocialNetworking } from "@/components/social/SocialNetworking";

interface SavedJob {
  id: string;
  job_id: string;
  status: string;
  notes: string;
  created_at: string;
  scraped_jobs?: {
    title: string;
    company: string;
    location: string;
    job_type: string;
    description: string;
    application_url: string;
    created_at: string;
  };
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
      fetchProfile();
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          scraped_jobs (
            title,
            company,
            location,
            job_type,
            description,
            application_url,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoadingSavedJobs(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const stats = [
    {
      title: "Saved Jobs",
      value: savedJobs.length,
      icon: BookmarkIcon,
      color: "bg-blue-500",
    },
    {
      title: "Applications",
      value: "0", // TODO: Implement job applications
      icon: BriefcaseIcon,
      color: "bg-green-500",
    },
    {
      title: "Profile Views",
      value: "0", // TODO: Implement profile views
      icon: UserIcon,
      color: "bg-purple-500",
    },
    {
      title: "Success Rate",
      value: "0%", // TODO: Calculate based on applications
      icon: TrendingUpIcon,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || user.email}</h1>
        <p className="text-muted-foreground">Here's your enhanced job search dashboard with AI and social features</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-md ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="saved-jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
          <TabsTrigger value="ai-recommendations">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Jobs
          </TabsTrigger>
          <TabsTrigger value="social-network">
            <Users className="h-4 w-4 mr-1" />
            Network
          </TabsTrigger>
          <TabsTrigger value="social-share">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="saved-jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Saved Jobs</h2>
            <Button asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>

          {loadingSavedJobs ? (
            <div className="text-center py-8">Loading saved jobs...</div>
          ) : savedJobs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookmarkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No saved jobs yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start saving jobs you're interested in to keep track of them
                </p>
                <Button asChild>
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {savedJobs.map((savedJob) => (
                <Card key={savedJob.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {savedJob.scraped_jobs?.title || 'Job Title Not Available'}
                        </h3>
                        <p className="text-muted-foreground">
                          {savedJob.scraped_jobs?.company || 'Company Not Available'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">
                            {savedJob.scraped_jobs?.location || 'Location N/A'}
                          </Badge>
                          <Badge variant="outline">
                            {savedJob.scraped_jobs?.job_type || 'Type N/A'}
                          </Badge>
                          <Badge variant="secondary">{savedJob.status}</Badge>
                        </div>
                        {savedJob.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Notes: {savedJob.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Saved {new Date(savedJob.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai-recommendations" className="space-y-4">
          <AIJobRecommendations />
        </TabsContent>

        <TabsContent value="social-network" className="space-y-4">
          <SocialNetworking />
        </TabsContent>

        <TabsContent value="social-share" className="space-y-4">
          <SocialShareHub />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <p className="text-muted-foreground">
                  {profile?.full_name || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="text-muted-foreground">
                  {profile?.role || 'job_seeker'}
                </p>
              </div>
              <Button asChild>
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardContent className="py-8 text-center">
              <TrendingUpIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Activity Timeline</h3>
              <p className="text-muted-foreground">
                View your job search activity (Coming Soon)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
