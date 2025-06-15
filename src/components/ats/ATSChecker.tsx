
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

export const ATSChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      toast.success('Resume uploaded successfully!');
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      toast.error('Please upload a resume first');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate ATS analysis
    setTimeout(() => {
      const mockResults = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        keywordMatch: Math.floor(Math.random() * 20) + 80,
        formatting: Math.floor(Math.random() * 15) + 85,
        readability: Math.floor(Math.random() * 10) + 90,
        suggestions: [
          'Add more supply chain specific keywords',
          'Include quantifiable achievements',
          'Optimize section headers for ATS parsing',
          'Add technical skills section',
          'Include industry certifications'
        ],
        strengths: [
          'Clear contact information',
          'Professional email format',
          'Consistent formatting',
          'Relevant work experience'
        ],
        weaknesses: [
          'Missing key industry keywords',
          'No quantified achievements',
          'Limited technical skills section'
        ]
      };
      
      setResults(mockResults);
      setIsAnalyzing(false);
      toast.success('Resume analysis complete!');
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            ATS Resume Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
            <p className="text-gray-500 mb-4">Upload a PDF file to analyze ATS compatibility</p>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="max-w-xs mx-auto"
            />
            {file && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {file.name} uploaded
              </p>
            )}
          </div>

          <Button 
            onClick={analyzeResume} 
            disabled={!file || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>ATS Compatibility Score</span>
                <Badge variant={getScoreBadgeVariant(results.score)} className="text-lg px-3 py-1">
                  <Star className="h-4 w-4 mr-1" />
                  {results.score}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Keyword Match</span>
                    <span className={getScoreColor(results.keywordMatch)}>{results.keywordMatch}%</span>
                  </div>
                  <Progress value={results.keywordMatch} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Formatting</span>
                    <span className={getScoreColor(results.formatting)}>{results.formatting}%</span>
                  </div>
                  <Progress value={results.formatting} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Readability</span>
                    <span className={getScoreColor(results.readability)}>{results.readability}%</span>
                  </div>
                  <Progress value={results.readability} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
