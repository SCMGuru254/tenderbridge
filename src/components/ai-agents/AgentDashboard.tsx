
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AgentStats {
  totalJobs: number;
  matchedJobs: number;
  newsAnalyzed: number;
  careersAdvised: number;
  socialEngagement: number;
}

const AgentDashboard = () => {
  const [stats, setStats] = useState<AgentStats>({
    totalJobs: 0,
    matchedJobs: 0,
    newsAnalyzed: 0,
    careersAdvised: 0,
    socialEngagement: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalJobs: 1250,
      matchedJobs: 340,
      newsAnalyzed: 89,
      careersAdvised: 156,
      socialEngagement: 78
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Agents Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Matching</CardTitle>
            <CardDescription>Jobs processed and matched</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.matchedJobs}</div>
            <p className="text-sm text-muted-foreground">out of {stats.totalJobs} total jobs</p>
            <Progress value={(stats.matchedJobs / stats.totalJobs) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>News Analysis</CardTitle>
            <CardDescription>Supply chain insights generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newsAnalyzed}</div>
            <p className="text-sm text-muted-foreground">articles analyzed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Guidance</CardTitle>
            <CardDescription>Users advised this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.careersAdvised}</div>
            <p className="text-sm text-muted-foreground">career sessions completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;
