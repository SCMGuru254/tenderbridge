
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Heart, 
  Eye, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SavedJob {
  id: string;
  created_at: string;
  notes?: string;
  scraped_jobs?: {
    id: string;
    title: string;
    company: string;
    location: string;
    job_type?: string;
    job_url?: string;
  };
}

interface JobApplication {
  id: string;
  status: string;
  created_at: string;
  jobs?: {
    id: string;
    title: string;
    location: string;
  };
}

interface ActivityItem {
  type: string;
  action: string;
  details: string;
  timestamp: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    totalSavedJobs: 0,
    totalApplications: 0,
    recentActivity: [] as ActivityItem[],
    jobAlerts: []
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch saved jobs
      const { data: saved, error: savedError } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          scraped_jobs (
            id,
            title,
            company,
            location,
            job_type,
            created_at,
            job_url
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (savedError) throw savedError;
      setSavedJobs(saved || []);

      // Fetch job applications
      const { data: applications, error: appError } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            id,
            title,
            location,
            company_id
          )
        `)
        .eq('applicant_id', user?.id)
        .order('created_at', { ascending: false });

      if (appError) throw appError;
      setAppliedJobs(applications || []);

      // Fetch profile views
      const { data: views, error: viewsError } = await supabase
        .from('profile_views')
        .select('id')
        .eq('profile_id', user?.id);

      if (viewsError) throw viewsError;
      setProfileViews(views?.length || 0);

      // Update dashboard stats
      setDashboardStats({
        totalSavedJobs: saved?.length || 0,
        totalApplications: applications?.length || 0,
        recentActivity: [
          ...(saved?.slice(0, 3).map(job => ({
            type: 'saved',
            action: 'Saved job',
            details: job.scraped_jobs?.title || 'Unknown Job',
            timestamp: job.created_at
          })) || []),
          ...(applications?.slice(0, 3).map(app => ({
            type: 'applied',
            action: 'Applied to job',
            details: app.jobs?.title || 'Unknown Job',
            timestamp: app.created_at
          })) || [])
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5),
        jobAlerts: []
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const removeJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', jobId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      console.error('Error removing job:', error);
      toast.error('Failed to remove job');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.user_metadata?.full_name || user.email}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saved Jobs</p>
                <p className="text-2xl font-bold">{dashboardStats.totalSavedJobs}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{dashboardStats.totalApplications}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{profileViews}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saved-jobs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="saved-jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Saved Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {savedJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No saved jobs yet. Start browsing jobs to save them for later!
                </p>
              ) : (
                <div className="space-y-4">
                  {savedJobs.map((savedJob) => (
                    <div key={savedJob.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{savedJob.scraped_jobs?.title}</h3>
                          <p className="text-sm text-muted-foreground">{savedJob.scraped_jobs?.company}</p>
                          <p className="text-sm text-muted-foreground">{savedJob.scraped_jobs?.location}</p>
                          {savedJob.scraped_jobs?.job_type && (
                            <Badge variant="outline" className="mt-2">
                              {savedJob.scraped_jobs.job_type}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {savedJob.scraped_jobs?.job_url && (
                            <Button asChild size="sm">
                              <a href={savedJob.scraped_jobs.job_url} target="_blank" rel="noopener noreferrer">
                                Apply
                              </a>
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeJob(savedJob.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      {savedJob.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">
                            <strong>Notes:</strong> {savedJob.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {appliedJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No applications yet. Start applying to jobs through our platform!
                </p>
              ) : (
                <div className="space-y-4">
                  {appliedJobs.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{application.jobs?.title}</h3>
                          <p className="text-sm text-muted-foreground">{application.jobs?.location}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={
                              application.status === 'accepted' ? 'default' :
                              application.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }>
                              {application.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Applied {new Date(application.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {application.status === 'accepted' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {application.status === 'rejected' && <AlertCircle className="h-5 w-5 text-red-500" />}
                          {application.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardStats.recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No recent activity. Start exploring jobs to see your activity here!
                </p>
              ) : (
                <div className="space-y-4">
                  {dashboardStats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'saved' && <Heart className="h-5 w-5 text-red-500" />}
                        {activity.type === 'applied' && <Briefcase className="h-5 w-5 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
