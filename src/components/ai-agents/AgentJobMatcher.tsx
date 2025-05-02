
import { useState } from "react";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AIAgent, AGENT_ROLES } from "@/services/agents"; // Fixed import path
import { useToast } from "@/hooks/use-toast";

interface JobMatch {
  job: {
    title: string;
    description: string;
    company?: string;
  };
  score: number;
}

export default function AgentJobMatcher() {
  const [resume, setResume] = useState("");
  const [jobDescriptions, setJobDescriptions] = useState("");
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const { toast } = useToast();
  
  const jobMatcher = new AIAgent(AGENT_ROLES.JOB_MATCHER);

  const handleFindMatches = async () => {
    if (!resume.trim() || !jobDescriptions.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both your resume and job descriptions",
        variant: "destructive"
      });
      return;
    }
    
    // Parse job descriptions (assuming one per paragraph)
    const jobs = jobDescriptions
      .split("\n\n")
      .filter(job => job.trim())
      .map((description, index) => ({
        id: `job-${index}`,
        title: `Job ${index + 1}`,
        description
      }));
    
    if (jobs.length === 0) {
      toast({
        title: "Invalid job descriptions",
        description: "Please enter job descriptions separated by blank lines",
        variant: "destructive"
      });
      return;
    }
    
    setIsMatching(true);
    
    try {
      const userProfile = { 
        resume, 
        embeddings: [] // The embeddings will be calculated by the matcher
      };
      
      const results = await jobMatcher.matchJobs(jobs, userProfile);
      
      if (!results || results.length === 0) {
        throw new Error("No matching results returned");
      }
      
      // Sort by score descending
      const sortedMatches = [...results].sort((a, b) => b.score - a.score);
      setMatches(sortedMatches);
      
    } catch (error) {
      console.error("Job matching error:", error);
      toast({
        title: "Matching failed",
        description: "Unable to process job matches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Match Calculator</CardTitle>
        <CardDescription>
          Find how well your resume matches job descriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="resume">Your Resume/CV</Label>
          <Textarea 
            id="resume"
            placeholder="Paste your resume content here..." 
            className="min-h-[120px]" 
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="jobs">Job Descriptions (separate multiple jobs with blank lines)</Label>
          <Textarea 
            id="jobs"
            placeholder="Paste job descriptions here..." 
            className="min-h-[120px]" 
            value={jobDescriptions}
            onChange={(e) => setJobDescriptions(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleFindMatches}
          disabled={isMatching || !resume.trim() || !jobDescriptions.trim()}
          className="w-full"
        >
          {isMatching ? "Calculating Matches..." : "Find Matches"}
        </Button>
        
        {matches.length > 0 && (
          <div className="mt-6 space-y-4">
            <Separator />
            <h3 className="font-medium text-lg">Match Results:</h3>
            
            <div className="space-y-4">
              {matches.map((match, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{match.job.title}</h4>
                    <Badge variant={match.score > 0.7 ? "default" : "secondary"}>
                      {(match.score * 100).toFixed(0)}% Match
                    </Badge>
                  </div>
                  <Progress value={match.score * 100} className="h-2 mb-4" />
                  <p className="text-sm text-muted-foreground">{match.job.description.substring(0, 150)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
