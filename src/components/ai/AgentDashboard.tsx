import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Users, MessageSquare, Target, Briefcase } from 'lucide-react';

interface ActivityLog {
  date: string;
  type: 'resume' | 'interview' | 'job' | 'career' | 'skill';
  action: string;
}

interface SkillProgress {
  skill: string;
  progress: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const AgentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const loadDashboardData = async () => {
      try {
        // Replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Mock data - replace with real data from your backend
  const recentActivity: ActivityLog[] = [
    {
      date: '2025-08-15',
      type: 'resume',
      action: 'Resume analyzed with AI feedback'
    },
    {
      date: '2025-08-14',
      type: 'interview',
      action: 'Completed mock interview practice'
    },
    {
      date: '2025-08-13',
      type: 'job',
      action: 'Applied to 3 recommended positions'
    }
  ];

  const skillProgress: SkillProgress[] = [
    { skill: 'Supply Chain Management', progress: 85, level: 'Advanced' },
    { skill: 'Logistics', progress: 70, level: 'Intermediate' },
    { skill: 'Procurement', progress: 90, level: 'Advanced' },
    { skill: 'Inventory Management', progress: 65, level: 'Intermediate' }
  ];

  const stats = {
    jobApplications: 12,
    interviews: 3,
    skillsImproved: 8,
    aiInteractions: 24
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Job Applications</p>
                    <h3 className="text-2xl font-bold mt-2">{stats.jobApplications}</h3>
                  </div>
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Interviews</p>
                    <h3 className="text-2xl font-bold mt-2">{stats.interviews}</h3>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Skills Improved</p>
                    <h3 className="text-2xl font-bold mt-2">{stats.skillsImproved}</h3>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Interactions</p>
                    <h3 className="text-2xl font-bold mt-2">{stats.aiInteractions}</h3>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillProgress.map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="link" className="mt-4 w-full">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
