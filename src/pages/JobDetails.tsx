import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar, MapPin, Building, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCompanyName, getLocation, getJobUrl, getJobSource, getSafeArray } from '@/utils/jobUtils';
import { toast } from 'sonner';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // First try to fetch from posted jobs
  const { data: postedJob, isLoading: isLoadingPosted } = useQuery({
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
      return data;
    },
    enabled: !!id,
  });

  // If not found in posted jobs, try scraped jobs
  const { data: scrapedJob, isLoading: isLoadingScraped } = useQuery({
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
      return data;
    },
    enabled: !!id && (!postedJob || isLoadingPosted),
  });

  const job = postedJob || scrapedJob;
  const isLoading = isLoadingPosted || isLoadingScraped;

  const handleApply = () => {
    const jobUrl = getJobUrl(job);
    if (jobUrl) {
      if (jobUrl.startsWith('/')) {
        // Internal link
        navigate(jobUrl);
      } else {
        // External link
        window.open(jobUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      toast.error("Application link not available");
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

  // Safely get arrays from job data
  const requirements = getSafeArray(job.requirements);
  const responsibilities = getSafeArray(job.responsibilities);
  const skills = getSafeArray(job.skills);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Button 
        variant="outline" 
        onClick={() => navigate('/jobs')} 
        className="mb-6"
      >
        Back to Jobs
      </Button>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
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
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 border-t">
          <div>
            {job.application_deadline && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <Button onClick={handleApply} className="flex items-center gap-2">
            Apply Now <ExternalLink className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Add the job matching analysis component here in the future */}
    </div>
  );
};

export default JobDetails;
