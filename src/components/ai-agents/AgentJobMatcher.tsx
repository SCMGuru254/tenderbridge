
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
      // Simulate job matching with mock scores
      const mockMatches: JobMatch[] = jobs.map(job => ({
        job: {
          title: job.title,
          description: job.description,
          company: "Sample Company"
        },
        score: Math.random() * 0.4 + 0.6 // Random score between 0.6 and 1.0
      }));
      
      // Sort by score descending
      const sortedMatches = mockMatches.sort((a, b) => b.score - a.score);
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResume(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="jobs">Job Descriptions (separate multiple jobs with blank lines)</Label>
          <Textarea 
            id="jobs"
            placeholder="Paste job descriptions here..." 
            className="min-h-[120px]" 
            value={jobDescriptions}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescriptions(e.target.value)}
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
