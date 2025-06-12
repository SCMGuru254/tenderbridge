import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  DollarSign, 
  ExternalLink,
  Bookmark,
  Share2,
  ArrowLeft,
  AlertTriangle
} from "lucide-react";
import { jobService } from "@/services/jobService";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import type { PostedJob, ScrapedJob } from "@/types/jobs";

export default function JobDetails() {
  const { id, type } = useParams<{ id: string; type: 'posted' | 'scraped' }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [job, setJob] = useState<PostedJob | ScrapedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  useEffect(() => {
    if (id && type) {
      loadJobDetails(id, type);
    }
  }, [id, type]);

  const loadJobDetails = async (jobId: string, jobType: 'posted' | 'scraped') => {
    try {
      setLoading(true);
      const jobData = await jobService.getJobById(jobId, jobType);
      setJob(jobData);
    } catch (error) {
      console.error('Error loading job details:', error);
      toast("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast("Please sign in to save jobs");
      return;
    }
    
    setSaved(!saved);
    toast(saved ? "Job removed from saved" : "Job saved successfully");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast("Link copied to clipboard");
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleApply = () => {
    if (!job) return;
    
    const applyUrl = (job as any).apply_url || (job as any).source_url || (job as any).job_url;
    if (applyUrl) {
      window.open(applyUrl, '_blank');
    } else {
      toast("No application link available");
    }
  };

  const handleReport = async (reason: string) => {
    if (!user || !job) return;
    
    try {
      await jobService.reportJob(job.id, reason, user.id);
      setReportDialogOpen(false);
      toast("Job reported successfully");
    } catch (error) {
      toast("Failed to report job");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/jobs')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const isPostedJob = (job: PostedJob | ScrapedJob): job is PostedJob => {
    return 'requirements' in job;
  };

  const formatSalary = (salary: string | number | null | undefined) => {
    if (!salary) return "Salary not specified";
    return typeof salary === 'string' ? salary : `$${salary.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/jobs')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {(job as any).company && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{typeof (job as any).company === 'string' ? (job as any).company : (job as any).company?.name || 'Unknown Company'}</span>
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {formatDate((job as any).posted_at || job.created_at)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveJob}>
                <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => setReportDialogOpen(true)}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements - Only for posted jobs */}
            {isPostedJob(job) && (job as PostedJob).requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{(job as PostedJob).requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Responsibilities - Only for posted jobs */}
            {isPostedJob(job) && (job as PostedJob).responsibilities && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{(job as PostedJob).responsibilities}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills - Only for posted jobs */}
            {isPostedJob(job) && (job as any).skills && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(job as any).skills.split(',').map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  onClick={handleApply}
                  className="w-full mb-4"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
                
                <Separator className="my-4" />
                
                {/* Job Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Job Details</h4>
                    <div className="space-y-2 text-sm">
                      {job.job_type && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge variant="outline">{job.job_type}</Badge>
                        </div>
                      )}
                      
                      {(job as any).salary && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Salary:</span>
                          <span className="font-medium">{formatSalary((job as any).salary)}</span>
                        </div>
                      )}
                      
                      {(job as any).deadline && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deadline:</span>
                          <span>{formatDate((job as any).deadline)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Posted:</span>
                        <span>{formatDate((job as any).posted_at || job.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags/Categories */}
            {((job as any).tags || job.category) && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.category && (
                      <Badge variant="secondary">{job.category}</Badge>
                    )}
                    {(job as any).tags && (job as any).tags.length > 0 && (
                      (job as any).tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
