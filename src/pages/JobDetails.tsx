
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Calendar, ExternalLink } from "lucide-react";
import { PostedJob, ScrapedJob } from "@/types/jobs";
import { getCompanyName, getLocation, getJobUrl, getJobSource } from "@/utils/jobUtils";

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const job = location.state?.job as (PostedJob | ScrapedJob) | undefined;
  
  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" onClick={() => navigate('/jobs')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
          </Button>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Job Not Found</CardTitle>
            <CardDescription>
              The job details could not be loaded. It may have been removed or expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please go back to the jobs list and try another listing.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/jobs')}>View All Jobs</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const jobSource = getJobSource(job);
  const jobUrl = getJobUrl(job);
  const formattedDate = new Date(job.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
        </Button>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">{job.title}</CardTitle>
              <CardDescription className="flex flex-wrap gap-2 mt-2">
                {jobSource && <Badge variant="outline">{jobSource}</Badge>}
                {job.job_type && <Badge variant="outline">{job.job_type}</Badge>}
              </CardDescription>
            </div>
            {jobUrl && (
              <Button className="shrink-0" onClick={() => window.open(jobUrl, "_blank")}>
                Apply Now <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            {getCompanyName(job) && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{getCompanyName(job)}</span>
              </div>
            )}
            {getLocation(job) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{getLocation(job)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Posted on {formattedDate}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            {job.description ? (
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            ) : (
              <p className="text-gray-500">No description available.</p>
            )}
          </div>
          
          {'requirements' in job && job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          {'responsibilities' in job && job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          )}
          
          {'skills' in job && job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6">
          {jobUrl ? (
            <Button onClick={() => window.open(jobUrl, "_blank")}>
              Apply on {jobSource} <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => navigate('/jobs')}>
              Back to Jobs
            </Button>
          )}
          <div className="text-sm text-gray-500">
            Job ID: {job.id}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobDetails;
