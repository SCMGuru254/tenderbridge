
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface ATSScore {
  overall: number;
  sections: {
    formatting: { score: number; feedback: string[] };
    keywords: { score: number; feedback: string[]; matches: string[]; missing: string[] };
    structure: { score: number; feedback: string[] };
    readability: { score: number; feedback: string[] };
  };
  recommendations: string[];
}

export const ATSChecker = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ATSScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ATS Keywords for supply chain jobs
  const supplyChainKeywords = [
    'supply chain', 'logistics', 'procurement', 'inventory management',
    'vendor management', 'warehouse', 'distribution', 'forecasting',
    'lean manufacturing', 'six sigma', 'ERP', 'SAP', 'WMS', 'TMS',
    'cost reduction', 'process improvement', 'KPI', 'analytics',
    'sourcing', 'negotiation', 'contract management', 'quality assurance',
    'demand planning', 'transportation', 'shipping', 'receiving'
  ];

  const analyzeResume = () => {
    if (!resumeText.trim()) {
      toast.error('Please enter your resume text');
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const result = performATSAnalysis(resumeText, jobDescription);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      toast.success('ATS analysis completed!');
    }, 2000);
  };

  const performATSAnalysis = (resume: string, jobDesc: string): ATSScore => {
    const resumeLower = resume.toLowerCase();
    const jobDescLower = jobDesc.toLowerCase();

    // Extract keywords from job description or use default supply chain keywords
    const targetKeywords = jobDesc 
      ? extractKeywords(jobDescLower)
      : supplyChainKeywords;

    // Analyze keyword matches
    const keywordMatches = targetKeywords.filter(keyword => 
      resumeLower.includes(keyword.toLowerCase())
    );
    const missingKeywords = targetKeywords.filter(keyword => 
      !resumeLower.includes(keyword.toLowerCase())
    );

    // Scoring logic
    const keywordScore = Math.round((keywordMatches.length / targetKeywords.length) * 100);
    const formattingScore = analyzeFormatting(resume);
    const structureScore = analyzeStructure(resume);
    const readabilityScore = analyzeReadability(resume);

    const overallScore = Math.round(
      (keywordScore * 0.4 + formattingScore * 0.2 + structureScore * 0.25 + readabilityScore * 0.15)
    );

    return {
      overall: overallScore,
      sections: {
        formatting: {
          score: formattingScore,
          feedback: getFormattingFeedback(resume)
        },
        keywords: {
          score: keywordScore,
          feedback: getKeywordFeedback(keywordMatches.length, targetKeywords.length),
          matches: keywordMatches,
          missing: missingKeywords.slice(0, 10) // Show top 10 missing
        },
        structure: {
          score: structureScore,
          feedback: getStructureFeedback(resume)
        },
        readability: {
          score: readabilityScore,
          feedback: getReadabilityFeedback(resume)
        }
      },
      recommendations: generateRecommendations(overallScore, keywordMatches.length, targetKeywords.length)
    };
  };

  const extractKeywords = (jobDesc: string): string[] => {
    // Simple keyword extraction - in real app this would be more sophisticated
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = jobDesc
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 20);
    
    return [...new Set([...supplyChainKeywords, ...words])];
  };

  const analyzeFormatting = (resume: string): number => {
    let score = 100;
    
    // Check for special characters that might break ATS
    if (/[^\w\s\-\(\)\[\]\{\}\.,;:!?'"@#$%&*+=<>\/\\|~`^]/.test(resume)) score -= 20;
    
    // Check for consistent formatting
    if (!/\n\s*\n/.test(resume)) score -= 10; // No clear sections
    
    return Math.max(score, 0);
  };

  const analyzeStructure = (resume: string): number => {
    let score = 0;
    const sections = ['experience', 'education', 'skills', 'summary', 'objective'];
    
    sections.forEach(section => {
      if (new RegExp(section, 'i').test(resume)) score += 20;
    });
    
    return Math.min(score, 100);
  };

  const analyzeReadability = (resume: string): number => {
    const sentences = resume.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = resume.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Ideal range: 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) return 100;
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) return 80;
    if (avgWordsPerSentence >= 5 && avgWordsPerSentence <= 30) return 60;
    return 40;
  };

  const getFormattingFeedback = (resume: string): string[] => {
    const feedback = [];
    
    if (/[^\w\s\-\(\)\[\]\{\}\.,;:!?'"@#$%&*+=<>\/\\|~`^]/.test(resume)) {
      feedback.push('Remove special characters that may confuse ATS systems');
    }
    
    if (!/\n\s*\n/.test(resume)) {
      feedback.push('Add clear section breaks between different parts of your resume');
    }
    
    if (feedback.length === 0) {
      feedback.push('Good formatting! Your resume should parse well through ATS systems');
    }
    
    return feedback;
  };

  const getKeywordFeedback = (matches: number, total: number): string[] => {
    const percentage = (matches / total) * 100;
    
    if (percentage >= 70) {
      return ['Excellent keyword optimization! Your resume aligns well with the job requirements.'];
    } else if (percentage >= 50) {
      return ['Good keyword coverage. Consider adding a few more relevant terms.'];
    } else if (percentage >= 30) {
      return ['Moderate keyword match. You should include more industry-specific terms.'];
    } else {
      return ['Low keyword optimization. Your resume needs significant improvement to match job requirements.'];
    }
  };

  const getStructureFeedback = (resume: string): string[] => {
    const feedback = [];
    const sections = ['experience', 'education', 'skills', 'summary', 'objective'];
    const missingSections = sections.filter(section => 
      !new RegExp(section, 'i').test(resume)
    );
    
    if (missingSections.length > 0) {
      feedback.push(`Consider adding these sections: ${missingSections.join(', ')}`);
    } else {
      feedback.push('Great structure! All essential sections are present.');
    }
    
    return feedback;
  };

  const getReadabilityFeedback = (resume: string): string[] => {
    const sentences = resume.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = resume.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0) return ['Add more content to your resume'];
    
    const avgWordsPerSentence = words.length / sentences.length;
    
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
      return ['Perfect readability! Your sentences are well-structured.'];
    } else if (avgWordsPerSentence > 25) {
      return ['Consider breaking up long sentences for better readability.'];
    } else if (avgWordsPerSentence < 10) {
      return ['Your sentences might be too short. Try combining related ideas.'];
    }
    
    return ['Good readability overall.'];
  };

  const generateRecommendations = (score: number, matches: number, total: number): string[] => {
    const recommendations = [];
    
    if (score < 60) {
      recommendations.push('Your resume needs significant optimization for ATS systems');
    }
    
    if ((matches / total) < 0.5) {
      recommendations.push('Include more industry-specific keywords and skills');
      recommendations.push('Study the job description carefully and mirror its language');
    }
    
    recommendations.push('Use standard section headings like "Experience", "Education", "Skills"');
    recommendations.push('Save your resume in both PDF and Word formats');
    recommendations.push('Quantify your achievements with specific numbers and metrics');
    
    return recommendations;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            ATS Resume Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Resume Text (Required)
              </label>
              <Textarea
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[300px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description (Optional - will use supply chain keywords if empty)
              </label>
              <Textarea
                placeholder="Paste the job description here for targeted analysis..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[300px]"
              />
            </div>
          </div>
          
          <Button 
            onClick={analyzeResume} 
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className={`text-4xl font-bold ${getScoreColor(analysisResult.overall)}`}>
                  {analysisResult.overall}%
                </div>
                <div className="text-lg text-muted-foreground">ATS Compatibility Score</div>
                <Progress value={analysisResult.overall} className="w-full max-w-md mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analysisResult.sections).map(([key, section]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{key}</h3>
                    {getScoreIcon(section.score)}
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(section.score)}`}>
                    {section.score}%
                  </div>
                  <Progress value={section.score} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Keywords Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Keywords Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-600">Matched Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.sections.keywords.matches.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {analysisResult.sections.keywords.missing.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.sections.keywords.missing.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-red-200 text-red-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
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
