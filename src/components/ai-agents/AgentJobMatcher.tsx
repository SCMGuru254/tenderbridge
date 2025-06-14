
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Briefcase, Star } from 'lucide-react';
import { aiService } from '@/services/openaiService';

const AgentJobMatcher = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.analyzeJobMatch({
        resume,
        jobDescription
      });
      setMatchResult(result);
    } catch (error) {
      console.error('Error analyzing job match:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            AI Job Matcher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="resume">Your Resume/Skills</Label>
              <Textarea
                id="resume"
                placeholder="Paste your resume or describe your skills and experience..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            <div>
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description you're interested in..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={loading || !resume.trim() || !jobDescription.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              'Analyze Job Match'
            )}
          </Button>
        </CardContent>
      </Card>

      {matchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Match Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{matchResult.score}%</div>
              <div className="text-muted-foreground">Match Score</div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Matching Factors</h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.matchingFactors.map((factor: string, index: number) => (
                  <Badge key={index} variant="secondary">{factor}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Skills to Develop</h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1">
                {matchResult.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentJobMatcher;
