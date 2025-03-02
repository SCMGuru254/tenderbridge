
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Calendar, ExternalLink, BriefcaseIcon, Star, Check, X } from "lucide-react";
import { PostedJob, ScrapedJob } from "@/types/jobs";
import { getCompanyName, getLocation, getJobUrl, getJobSource } from "@/utils/jobUtils";
import { Progress } from "@/components/ui/progress";

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

  // Safely check for arrays with TypeScript
  const hasRequirements = 'requirements' in job && 
    Array.isArray(job.requirements) && 
    job.requirements.length > 0;
    
  const hasResponsibilities = 'responsibilities' in job && 
    Array.isArray(job.responsibilities) && 
    job.responsibilities.length > 0;
    
  const hasSkills = 'skills' in job && 
    Array.isArray(job.skills) && 
    job.skills.length > 0;

  // AI match score (simulated for now)
  const matchScore = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
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
            
            {hasRequirements && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {hasResponsibilities && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {hasSkills && (
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

        {/* AI Job Match Analysis Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Job Match Analysis</CardTitle>
              <CardDescription>Powered by AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className="text-sm font-medium">{matchScore}%</span>
                </div>
                <Progress value={matchScore} className={`h-2 ${matchScore > 80 ? 'bg-green-100' : 'bg-amber-100'}`} />
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-semibold">Key Strengths</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Your experience matches this role</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">You have the required skills</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-semibold">Areas to Highlight</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-amber-500 mt-0.5" />
                    <span className="text-sm">Emphasize your {job.job_type || 'related'} experience</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-amber-500 mt-0.5" />
                    <span className="text-sm">Showcase problem-solving skills</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 mt-2 border-t">
                <Button variant="outline" className="w-full">
                  Tailor Your CV
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Find similar opportunities in supply chain management.</p>
              <Button className="w-full">
                View Similar Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
