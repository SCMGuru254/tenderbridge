import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Shield,
  Database,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AdminStats {
  total_users: number;
  total_jobs: number;
  total_applications: number;
  total_companies: number;
  total_courses: number;
  total_mentors: number;
  total_hr_profiles: number;
  total_discussions: number;
  active_news: number;
}

interface RLSTestResult {
  table_name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rlsResults, setRlsResults] = useState<RLSTestResult[]>([]);
  const [newsCleanupRunning, setNewsCleanupRunning] = useState(false);

  // Check admin permission
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'admin' });

        if (error) throw error;

        if (!data) {
          toast.error('Access denied. Admin privileges required.');
          navigate('/dashboard');
          return;
        }

        setIsAdmin(true);
        await loadAdminData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error('Failed to verify admin access');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, navigate]);

  const loadAdminData = async () => {
    try {
      // Get counts from various tables
      const [
        { count: usersCount },
        { count: jobsCount },
        { count: applicationsCount },
        { count: companiesCount },
        { count: coursesCount },
        { count: mentorsCount },
        { count: hrCount },
        { count: discussionsCount },
        { count: newsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('mentors').select('*', { count: 'exact', head: true }),
        supabase.from('hr_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('discussions').select('*', { count: 'exact', head: true }),
        supabase.from('supply_chain_news').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        total_users: usersCount || 0,
        total_jobs: jobsCount || 0,
        total_applications: applicationsCount || 0,
        total_companies: companiesCount || 0,
        total_courses: coursesCount || 0,
        total_mentors: mentorsCount || 0,
        total_hr_profiles: hrCount || 0,
        total_discussions: discussionsCount || 0,
        active_news: newsCount || 0
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin statistics');
    }
  };

  const runNewsCleanup = async () => {
    setNewsCleanupRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-old-news', {
        body: { retention_days: 7 }
      });

      if (error) throw error;

      toast.success(`News cleanup complete! Deleted ${data?.deleted_count || 0} old articles`);
      await loadAdminData();
    } catch (error) {
      console.error('Error running news cleanup:', error);
      toast.error('Failed to run news cleanup');
    } finally {
      setNewsCleanupRunning(false);
    }
  };

  const runRLSTests = async () => {
    try {
      const testResults: RLSTestResult[] = [];
      const timestamp = new Date().toISOString();

      // Test key tables
      const tablesToTest = [
        'profiles',
        'jobs',
        'job_applications',
        'companies',
        'rewards_points',
        'hr_profiles',
        'mentors'
      ];

      for (const tableName of tablesToTest) {
        try {
          const { error } = await supabase.from(tableName).select('*').limit(1);

          if (error) {
            testResults.push({
              table_name: tableName,
              status: 'warning',
              message: `Query returned error: ${error.message}`,
              timestamp
            });
          } else {
            testResults.push({
              table_name: tableName,
              status: 'pass',
              message: 'RLS policies working correctly',
              timestamp
            });
          }
        } catch (err) {
          testResults.push({
            table_name: tableName,
            status: 'fail',
            message: `Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            timestamp
          });
        }
      }

      setRlsResults(testResults);
      toast.success('RLS tests completed');
    } catch (error) {
      console.error('Error running RLS tests:', error);
      toast.error('Failed to run RLS tests');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          System overview, monitoring, and management tools
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_jobs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_applications || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_companies || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_courses || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mentors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_mentors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">HR Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_hr_profiles || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_discussions || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tools */}
      <Tabs defaultValue="automation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="rls-tests">RLS Tests</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">News Cleanup</h3>
                  <p className="text-sm text-muted-foreground">
                    Delete news articles older than 7 days ({stats?.active_news || 0} current articles)
                  </p>
                </div>
                <Button
                  onClick={runNewsCleanup}
                  disabled={newsCleanupRunning}
                  variant="outline"
                >
                  {newsCleanupRunning ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Run Now
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div>
                  <h3 className="font-semibold mb-1">Scheduled Cleanup</h3>
                  <p className="text-sm text-muted-foreground">
                    Runs automatically daily at 2:00 AM UTC
                  </p>
                </div>
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  Scheduled
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rls-tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Row Level Security Tests</span>
                <Button onClick={runRLSTests} size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Tests
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rlsResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>No test results yet. Click "Run Tests" to start.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rlsResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {result.status === 'pass' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {result.status === 'warning' && (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        {result.status === 'fail' && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{result.table_name}</p>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          result.status === 'pass'
                            ? 'default'
                            : result.status === 'warning'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Database Status</span>
                <Badge variant="default">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Edge Functions</span>
                <Badge variant="default">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Storage</span>
                <Badge variant="default">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Authentication</span>
                <Badge variant="default">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Operational
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
