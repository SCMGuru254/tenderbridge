
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Briefcase, ExternalLink, Flag, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import type { PostedJob, AggregatedJob } from "@/types/jobs";
import { getCompanyName, getLocation, getJobUrl, getJobSource } from "@/utils/jobUtils";

const JobDetails = () => {
  const { id, type } = useParams<{ id: string; type: 'posted' | 'aggregated' }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [job, setJob] = useState<PostedJob | AggregatedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      // Fallback to Supabase if local API fails
      try {
        const { data, error: sbError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
        if (sbError) throw sbError;
        setJob(data);
      } catch (sbErr) {
        console.error('Supabase fallback error:', sbErr);
        toast.error("Failed to load job details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error("Please sign in to apply for jobs");
      navigate("/auth");
      return;
    }

    if (!job) return;

    const jobUrl = getJobUrl(job);
    if (jobUrl) {
      window.open(jobUrl, '_blank');
      return;
    }

    // Handle internal application for posted jobs
    if (type === 'posted') {
      try {
        setApplying(true);
        
        const { error } = await supabase
          .from('job_applications')
          .insert({
            job_id: job.id,
            applicant_id: user.id,
            status: 'pending'
          });

        if (error) throw error;
        
        toast.success("Application submitted successfully!");
      } catch (error) {
        console.error('Error applying:', error);
        toast.error("Failed to submit application");
      } finally {
        setApplying(false);
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title}`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 mt-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12 mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  const jobCategory = getJobSource(job);
  const company = getCompanyName(job);
  const location = getLocation(job);

  return (
    <div className="container mx-auto px-4 py-12 mt-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/jobs")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {company && (
                      <Badge variant="secondary">
                        <Briefcase className="mr-1 h-3 w-3" />
                        {company}
                      </Badge>
                    )}
                    {location && (
                      <Badge variant="outline">
                        <MapPin className="mr-1 h-3 w-3" />
                        {location}
                      </Badge>
                    )}
                    <Badge variant="outline">{jobCategory}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>

              {type === 'posted' && (job as PostedJob).requirements && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {(job as PostedJob).requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {type === 'posted' && (job as PostedJob).responsibilities && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {(job as PostedJob).responsibilities?.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {type === 'aggregated' && (job as AggregatedJob).skills && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(job as AggregatedJob).skills?.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {job.job_type && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.job_type}</span>
                </div>
              )}

              {'salary_range' in job && job.salary_range && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Salary: {job.salary_range}</span>
                </div>
              )}

              {'application_deadline' in job && job.application_deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button 
                className="w-full mb-3" 
                onClick={handleApply}
                disabled={applying}
              >
                {getJobUrl(job) ? (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Apply on {jobCategory}
                  </>
                ) : (
                  applying ? "Applying..." : "Apply Now"
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                {getJobUrl(job) 
                  ? "You'll be redirected to the external application page"
                  : "Your application will be sent directly to the employer"
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
