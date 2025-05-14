
import { useParams, useNavigate } from 'react-router-dom';
import { PostgrestError } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar, MapPin, Building, Share2, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCompanyName, getLocation, getJobUrl, getJobSource, getSafeArray, getDeadline, hasExternalUrl } from '@/utils/jobUtils';
import { cleanJobTitle } from '@/utils/cleanJobTitle';
import { toast } from '@/components/ui/use-toast';
import { PostedJob, ScrapedJob } from '@/types/jobs';
import ErrorBoundary from '@/components/ErrorBoundary';

// Custom fallback component for database connection errors
const DatabaseErrorFallback = () => {
  const navigate = useNavigate();
  
  const handleRetry = () => {
    window.location.reload();
    toast({
      title: "Retrying connection",
      description: "Attempting to reconnect to the database..."
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <Button 
        variant="outline" 
        onClick={() => navigate('/jobs')} 
        className="mb-6"
      >
        Back to Jobs
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Service Temporarily Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>We're having trouble connecting to our job database at the moment.</p>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">This could be due to:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Temporary database maintenance</li>
                <li>Network connectivity issues</li>
                <li>High server load</li>
              </ul>
            </div>
            
            <p>Please try again in a few moments. We apologize for the inconvenience.</p>
            
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleRetry} 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // First try to fetch from posted jobs
  const { data: postedJob, isLoading: isLoadingPosted, error: postedJobError } = useQuery<PostedJob | null, PostgrestError>({
    queryKey: ['posted-job', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name,
            location
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching posted job:", error);
        if (error.code !== 'PGRST116') { // Not found error
          throw error;
        }
        return null;
      }
      return data as PostedJob;
    },
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff,
    gcTime: 1000 * 60 * 60, // Keep cached data for 1 hour
    networkMode: 'always'
  });

  // If not found in posted jobs, try scraped jobs
  const { data: scrapedJob, isLoading: isLoadingScraped, error: scrapedJobError } = useQuery<ScrapedJob | null, PostgrestError>({
    queryKey: ['scraped-job', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching scraped job:", error);
        if (error.code !== 'PGRST116') { // Not found error
          throw error;
        }
        return null;
      }
      console.log("Scraped job data:", data);
      return data as ScrapedJob;
    },
    enabled: !!id && (!postedJob || isLoadingPosted),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff,
    gcTime: 1000 * 60 * 60, // Keep cached data for 1 hour
    networkMode: 'always'
  });


  const job = postedJob || scrapedJob;
  const isLoading = isLoadingPosted || isLoadingScraped;
  const jobUrl = job ? getJobUrl(job) : null;
  const isExternalUrl = job ? hasExternalUrl(job) : false;
  const hasError = postedJobError || scrapedJobError;

  console.log("Job details:", job);
  console.log("Job URL:", jobUrl);
  console.log("Is external URL:", isExternalUrl);
  
  // If there's a database connection error, show the error fallback
  if (hasError && !isLoading) {
    return <DatabaseErrorFallback />;
  }

  const handleApply = () => {
    if (jobUrl) {
      if (isExternalUrl) {
        // External link - open in new tab
        window.open(jobUrl, '_blank', 'noopener,noreferrer');
        
        // Track application click (could be implemented later)
        toast({
          title: "Success",
          description: "Opening application page in a new tab"
        });
      } else {
        // Internal link to our own application process
        navigate(jobUrl);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Application link not available"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  // Safely get arrays from job data using getSafeArray utility
  const requirements = job ? getSafeArray(job.requirements) : [];
  const responsibilities = job ? getSafeArray(job.responsibilities) : [];
  const skills = job ? getSafeArray(job.skills) : [];
  const deadline = job ? getDeadline(job) : null;

  return (
    <ErrorBoundary fallback={<DatabaseErrorFallback />}>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <Button 
          variant="outline" 
          onClick={() => navigate('/jobs')} 
          className="mb-6"
        >
          Back to Jobs
        </Button>
        
        {isLoading ? (
          <div className="container mx-auto px-4 py-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Loading job details...</p>
          </div>
        ) : !job ? (
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
            <p className="mb-8">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
          </div>
        ) : (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{cleanJobTitle(job.title)}</CardTitle>
                <CardDescription className="mt-2 flex flex-wrap gap-2 items-center">
                  {getCompanyName(job) && (
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {getCompanyName(job)}
                    </span>
                  )}
                  {getLocation(job) && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {getLocation(job)}
                    </span>
                  )}
                  <Badge variant="secondary">{getJobSource(job)}</Badge>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard");
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {job.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
              )}
              
              {requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {responsibilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {job.salary_range && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Salary Range</h3>
                  <p>{job.salary_range}</p>
                </div>
              )}
              
              {isExternalUrl && jobUrl && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Application Link</h3>
                  <a 
                    href={jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {jobUrl} <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-6 border-t">
            <div>
              {deadline && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <Button 
              onClick={handleApply} 
              className="flex items-center gap-2"
            >
              Apply Now {isExternalUrl && <ExternalLink className="h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default JobDetails;
