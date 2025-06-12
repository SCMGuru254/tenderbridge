
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Search, Calendar, ExternalLink, Trash2 } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { getCompanyName } from "@/utils/jobUtils";
import type { JobType } from "@/types/jobs";

const SavedJobsDashboard = () => {
  const [savedJobs, setSavedJobs] = useState<JobType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for saved jobs
  useEffect(() => {
    const mockSavedJobs: JobType[] = [
      {
        id: "1",
        title: "Supply Chain Manager",
        job_type: "Full-time",
        created_at: "2024-01-15T00:00:00Z",
        location: "Nairobi, Kenya",
        company: "East African Logistics",
        description: "Lead supply chain operations across East Africa",
        posted_by: "HR Department",
        is_active: true,
        updated_at: "2024-01-15T00:00:00Z",
        salary_range: "KSh 150,000 - 200,000",
        social_shares: {}
      } as JobType,
      {
        id: "2", 
        title: "Procurement Specialist",
        job_type: "Contract",
        created_at: "2024-01-10T00:00:00Z",
        location: "Mombasa, Kenya",
        company: "Port Authority",
        description: "Handle procurement for port operations",
        posted_by: "Procurement Team",
        is_active: true,
        updated_at: "2024-01-10T00:00:00Z",
        salary_range: "KSh 120,000 - 150,000",
        social_shares: {}
      } as JobType
    ];
    setSavedJobs(mockSavedJobs);
  }, []);

  const filteredJobs = savedJobs.filter(job => {
    const companyName = getCompanyName(job);
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (companyName && companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "recent") {
      const jobDate = new Date(job.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && jobDate > weekAgo;
    }
    return matchesSearch;
  });

  const convertToJobCardProps = (job: JobType) => {
    const baseProps = {
      id: job.id,
      title: job.title,
      job_type: job.job_type,
      category: undefined,
      application_deadline: undefined,
      social_shares: job.social_shares || {}
    };

    if ('company' in job) {
      return {
        ...baseProps,
        company: job.company || null,
        location: job.location || null,
        job_url: 'job_url' in job ? job.job_url || null : null
      };
    } else {
      return {
        ...baseProps,
        company: getCompanyName(job) || null,
        location: job.location || null,
        job_url: null
      };
    }
  };

  const removeSavedJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Jobs</h1>
        <p className="text-muted-foreground">Manage your saved job opportunities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{savedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Total Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredJobs.filter(job => {
                    const jobDate = new Date(job.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return jobDate > weekAgo;
                  }).length}
                </p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Applied</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Saved Jobs</CardTitle>
          <CardDescription>
            Keep track of jobs you're interested in applying to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search saved jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Saved ({savedJobs.length})</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="relative">
                  <JobCard job={convertToJobCardProps(job)} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeSavedJob(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Start saving jobs you're interested in"}
                </p>
                <Button asChild>
                  <a href="/jobs">Browse Jobs</a>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedJobsDashboard;
