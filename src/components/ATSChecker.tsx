
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ATSScore {
  overall: number;
  keywords: number;
  formatting: number;
  sections: number;
  readability: number;
}

interface ATSResults {
  score: ATSScore;
  suggestions: string[];
  missingKeywords: string[];
  issues: string[];
}

export const ATSChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<ATSResults | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/msword' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
      } else {
        toast.error("Please upload a PDF or Word document");
      }
    }
  };

  const analyzeCV = async () => {
    if (!file) {
      toast.error("Please upload a CV/Resume");
      return;
    }

    setLoading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Call edge function for ATS analysis
      const { data, error } = await supabase.functions.invoke('ats-checker', {
        body: {
          filePath: uploadData.path,
          jobDescription: jobDescription
        }
      });

      if (error) throw error;

      setResults(data);
      toast.success("ATS analysis completed!");
    } catch (error) {
      console.error('ATS analysis error:', error);
      toast.error("Failed to analyze CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            ATS CV Checker
          </CardTitle>
          <p className="text-muted-foreground">
            Check how well your CV/Resume performs against Applicant Tracking Systems (ATS) 
            used by supply chain and logistics companies.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload your CV/Resume</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                {file && (
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description (Optional)
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Paste the job description here to get more accurate keyword matching..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <Button
              onClick={analyzeCV}
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? "Analyzing..." : "Analyze CV"}
            </Button>
          </div>

          {results && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getScoreIcon(results.score.overall)}
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(results.score.overall)}`}>
                      {results.score.overall}%
                    </div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-xl font-semibold ${getScoreColor(results.score.keywords)}`}>
                      {results.score.keywords}%
                    </div>
                    <p className="text-sm text-muted-foreground">Keywords</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-xl font-semibold ${getScoreColor(results.score.formatting)}`}>
                      {results.score.formatting}%
                    </div>
                    <p className="text-sm text-muted-foreground">Formatting</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-xl font-semibold ${getScoreColor(results.score.sections)}`}>
                      {results.score.sections}%
                    </div>
                    <p className="text-sm text-muted-foreground">Sections</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-xl font-semibold ${getScoreColor(results.score.readability)}`}>
                      {results.score.readability}%
                    </div>
                    <p className="text-sm text-muted-foreground">Readability</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Missing Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Issues to Fix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
