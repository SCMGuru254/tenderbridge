import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FileUploader } from '@/components/shared/FileUploader';
import { aiService } from '@/services/aiService';
import type { ResumeAnalysis } from '@/types/ai';

export const AgentResumeAnalyzer = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast({
        title: 'Error',
        description: 'Please upload a resume file first.',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeResume(resumeFile);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze resume. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resume Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Upload a resume to get AI-powered insights and recommendations.
          </p>

          <div className="space-y-4">
            <div>
              <Label>Upload Resume</Label>
              <FileUploader
                accept=".pdf,.doc,.docx"
                maxSize={5 * 1024 * 1024} // 5MB
                onFileSelect={setResumeFile}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!resumeFile || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </div>
        </div>
      </Card>

      {analysis && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill: any, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {typeof skill === 'string' ? skill : `${skill.skill} - ${skill.proficiency ?? ''}`}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Experience Level</h4>
              <p>{analysis.experienceLevel}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Industry Match</h4>
              <div className="space-y-2">
                {analysis.industryMatches.map((match: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{match.industry ?? match}</span>
                    <span className="font-medium">{match.score ? `${match.score}%` : ''}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc pl-4 space-y-2">
                {analysis.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
