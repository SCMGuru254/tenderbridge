
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "@/components/JobCard";
import { Loader2, BookMarked, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const [activeTab, setActiveTab] = useState("applications");
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch Saved Jobs
      // Note: We currently focus on scraped_jobs as per JobCard implementation
      const { data: savedData, error: savedError } = await supabase
        .from('saved_jobs')
        .select(`
          scraped_job_id,
          scraped_jobs (*)
        `)
        .eq('user_id', user.id);
        
      if (savedError) throw savedError;

      // Transform response to match JobCard format
      const savedList = savedData
        ?.filter(item => item.scraped_jobs)
        .map(item => ({
          ...item.scraped_jobs,
          // specific fields check for JobCard
          job_url: item.scraped_jobs.job_url,
          id: item.scraped_jobs.id
        })) || [];
        
      setSavedJobs(savedList);

      // Fetch Applications
      const { data: appData, error: appError } = await supabase
        .from('job_application_tracker')
        .select(`
          scraped_job_id,
          status,
          applied_at,
          scraped_jobs (*)
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (appError) throw appError;

      const appList = appData
        ?.filter(item => item.scraped_jobs)
        .map(item => ({
          ...item.scraped_jobs,
          tracker_status: item.status, // Pass this to job card if needed, or display separately using a wrapper
          applied_at: item.applied_at
        })) || [];

      setApplications(appList);

    } catch (error) {
      console.error("Error fetching my jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">My Career Activity</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs ({savedJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          {applications.length === 0 ? (
            <EmptyState 
              title="No applications tracked yet" 
              description="Mark jobs as 'Applied' to track your progress here."
              action={() => navigate("/jobs")}
              actionText="Browse Jobs"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((job) => (
                <div key={job.id} className="relative">
                   {/* We wrap JobCard to show status badge above it */}
                   <div className="mb-2 flex justify-end">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${
                        job.tracker_status === 'applied' ? 'bg-blue-100 text-blue-800' :
                        job.tracker_status === 'interviewing' ? 'bg-yellow-100 text-yellow-800' :
                        job.tracker_status === 'offer' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.tracker_status}
                      </span>
                   </div>
                   <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          {savedJobs.length === 0 ? (
             <EmptyState 
              title="No saved jobs" 
              description="Save jobs you're interested in to view them later."
              action={() => navigate("/jobs")}
              actionText="Browse Jobs"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const EmptyState = ({ title, description, action, actionText }: any) => (
  <Card className="text-center py-12">
    <CardContent className="flex flex-col items-center gap-4">
      <BookMarked className="h-12 w-12 text-muted-foreground opacity-50" />
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">{description}</p>
      </div>
      <Button onClick={action} className="mt-4">
        {actionText}
      </Button>
    </CardContent>
  </Card>
);
