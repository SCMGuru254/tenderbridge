import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Briefcase, MessageSquare, TrendingUp, Clock, Eye, Heart, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  jobsApplied: number;
  savedJobs: number;
  profileViews: number;
  interviewSessions: number;
  mentorshipSessions: number;
  rewardPoints: number;
  careerApplications: number;
  discussionsParticipated: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    jobsApplied: 0,
    savedJobs: 0,
    profileViews: 0,
    interviewSessions: 0,
    mentorshipSessions: 0,
    rewardPoints: 0,
    careerApplications: 0,
    discussionsParticipated: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Add a small delay to show immediate UI, then load data
      setTimeout(() => {
        fetchDashboardStats();
      }, 100);
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;
    
    console.log('Fetching dashboard stats for user:', user.id);
    
    try {
      // Use Promise.allSettled instead of Promise.all to handle individual failures
      const results = await Promise.allSettled([
        supabase.from('job_applications').select('id', { count: 'exact' }).eq('applicant_id', user.id),
        supabase.from('profile_views').select('id', { count: 'exact' }).eq('profile_id', user.id),
        supabase.from('interview_sessions').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('career_applications').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('discussions').select('id', { count: 'exact' }).eq('author_id', user.id)
      ]);

      console.log('Dashboard query results:', results);

      setStats({
        jobsApplied: results[0].status === 'fulfilled' ? (results[0].value.count || 0) : 0,
        savedJobs: 0, // This would need a saved_jobs table
        profileViews: results[1].status === 'fulfilled' ? (results[1].value.count || 0) : 0,
        interviewSessions: results[2].status === 'fulfilled' ? (results[2].value.count || 0) : 0,
        mentorshipSessions: 0, // This would need the mentorship_sessions table
        rewardPoints: 0, // This would need a rewards system
        careerApplications: results[3].status === 'fulfilled' ? (results[3].value.count || 0) : 0,
        discussionsParticipated: results[4].status === 'fulfilled' ? (results[4].value.count || 0) : 0
      });
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load some dashboard statistics');
    } finally {
      setIsLoading(false);
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

  const statCards = [
    {
      title: 'Jobs Applied',
      value: stats.jobsApplied,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Saved Jobs',
      value: stats.savedJobs,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Profile Views',
      value: stats.profileViews,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Interview Sessions',
      value: stats.interviewSessions,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Mentorship Sessions',
      value: stats.mentorshipSessions,
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Reward Points',
      value: stats.rewardPoints,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Career Applications',
      value: stats.careerApplications,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Discussions Started',
      value: stats.discussionsParticipated,
      icon: MessageSquare,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your activity overview.</p>
        </div>
        <Button onClick={fetchDashboardStats} disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          ) : (
            <TrendingUp className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Browse the latest supply chain and logistics opportunities.
            </p>
            <Button className="w-full">Browse Jobs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get career advice from our AI-powered assistants.
            </p>
            <Button className="w-full" variant="outline">Chat with AI</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Mentorship
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with industry experts for guidance.
            </p>
            <Button className="w-full" variant="outline">Find Mentors</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.jobsApplied === 0 && stats.profileViews === 0 && stats.interviewSessions === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity yet.</p>
              <p className="text-sm mt-2">Start exploring jobs and features to see your activity here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.jobsApplied > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Applied to {stats.jobsApplied} jobs</p>
                    <p className="text-sm text-muted-foreground">Keep tracking your applications</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">Recent</Badge>
                </div>
              )}
              
              {stats.profileViews > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{stats.profileViews} profile views</p>
                    <p className="text-sm text-muted-foreground">Your profile is getting attention</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">Active</Badge>
                </div>
              )}

              {stats.interviewSessions > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Completed {stats.interviewSessions} practice sessions</p>
                    <p className="text-sm text-muted-foreground">Great job preparing!</p>
                  </div>
                  <Badge variant="default" className="ml-auto">Completed</Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
