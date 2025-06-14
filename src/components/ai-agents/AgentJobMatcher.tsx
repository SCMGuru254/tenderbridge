
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { openaiService } from "@/services/openaiService";

interface JobMatch {
  job: {
    title: string;
    description: string;
    company?: string;
  };
  score: number;
  matchingFactors: string[];
  missingSkills: string[];
  recommendations: string[];
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
      // Use AI service to analyze job matches
      const aiMatches: JobMatch[] = [];
      
      for (const job of jobs) {
        const analysis = await openaiService.analyzeJobMatch({
          resume: resume,
          jobDescription: job.description
        });
        
        aiMatches.push({
          job: {
            title: job.title,
            description: job.description,
            company: "Company"
          },
          score: analysis.score,
          matchingFactors: analysis.matchingFactors,
          missingSkills: analysis.missingSkills,
          recommendations: analysis.recommendations
        });
      }
      
      // Sort by score descending
      const sortedMatches = aiMatches.sort((a, b) => b.score - a.score);
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
                    <Badge variant={match.score > 70 ? "default" : "secondary"}>
                      {match.score}% Match
                    </Badge>
                  </div>
                  <Progress value={match.score} className="h-2 mb-4" />
                  <p className="text-sm text-muted-foreground mb-3">{match.job.description.substring(0, 150)}...</p>
                  
                  {match.matchingFactors && match.matchingFactors.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-green-600 mb-1">Matching Factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.matchingFactors.slice(0, 3).map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{factor}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {match.missingSkills && match.missingSkills.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-orange-600 mb-1">Areas for Improvement:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.missingSkills.slice(0, 2).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
