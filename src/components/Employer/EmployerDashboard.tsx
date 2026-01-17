import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextFull';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Edit2, Trash2, Users, CreditCard, Gift, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ReferralCard } from './ReferralCard';
import { JobBoostModal } from './JobBoostModal';
import { EmployerPricingTable } from './EmployerPricingTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary_range: string;
  created_at: string;
  status: string;
  applications_count?: number;
  views_count?: number;
}

export function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      loadEmployerJobs();
    }
  }, [user]);

  const loadEmployerJobs = async () => {
    try {
      setLoading(true);
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('posted_by', user?.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      if (jobsData) {
        // Get applications count for each job
        const jobsWithStats = await Promise.all(
          jobsData.map(async (job) => {
            const { count: applicationsCount } = await supabase
              .from('job_applications')
              .select('*', { count: 'exact', head: true })
              .eq('job_id', job.id);

            return {
              ...job,
              applications_count: applicationsCount || 0,
            };
          })
        );

        setJobs(jobsWithStats);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;

    try {
      setDeleting(true);
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', deleteJobId)
        .eq('posted_by', user?.id);

      if (error) throw error;

      toast.success('Job deleted successfully');
      setDeleteJobId(null);
      loadEmployerJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/post-job?edit=${jobId}`);
  };

  const handleViewApplicants = (jobId: string) => {
    navigate(`/employer/applicants/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Employer Dashboard</h1>
          <p className="text-slate-600">Manage your job postings, view pricing, and track applications</p>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Jobs
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pricing & Boost
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">My Job Postings</h2>
              <Button onClick={() => navigate('/post-job')}>
                Post New Job
              </Button>
            </div>

            {/* Referral Program Card */}
            {user?.id && (
              <ReferralCard userId={user.id} />
            )}

            {jobs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-slate-600 mb-4">You haven't posted any jobs yet</p>
                  <Button onClick={() => navigate('/post-job')}>
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl">{job.title}</CardTitle>
                          <p className="text-slate-600 mt-2">{job.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">
                            Posted {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded">
                          <div className="text-sm text-slate-600">Applications</div>
                          <div className="text-2xl font-bold text-slate-900">
                            {job.applications_count || 0}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded">
                          <div className="text-sm text-slate-600">Salary Range</div>
                          <div className="text-lg font-semibold text-slate-900">
                            {job.salary_range || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-700 mb-6 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => handleViewApplicants(job.id)}
                          variant="default"
                          className="flex-1 min-w-[150px]"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Applicants ({job.applications_count || 0})
                        </Button>
                        <JobBoostModal 
                          jobId={job.id} 
                          jobTitle={job.title}
                          onBoostComplete={loadEmployerJobs}
                        />
                        <Button
                          onClick={() => handleEditJob(job.id)}
                          variant="outline"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setDeleteJobId(job.id)}
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <EmployerPricingTable />
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Employer Rewards Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Earn rewards for successful hiring and platform engagement!
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">First Hire Bonus</h4>
                    <p className="text-sm text-green-700">+100 points when you make your first hire through our platform</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Bulk Posting Reward</h4>
                    <p className="text-sm text-blue-700">+50 points for every 5 jobs posted</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Quality Employer Badge</h4>
                    <p className="text-sm text-purple-700">+200 points for maintaining 4.5+ rating</p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-slate-500">
                    Redeem points for featured placement, extended visibility, and more!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!deleteJobId} onOpenChange={(open) => !open && setDeleteJobId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}