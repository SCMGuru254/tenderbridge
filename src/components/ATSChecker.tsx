import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Upload, FileText, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ATSScore {
  overall: number;
  keywords: number;
  formatting: number;
  sections: number;
  readability: number;
}

interface ATSAnalysis {
  score: ATSScore;
  suggestions: string[];
  missingKeywords: string[];
  issues: string[];
}

interface UploadedDocument {
  id: string;
  filename: string;
  file_path: string;
  analyzed_at?: string;
  analysis_result?: ATSAnalysis;
}

export const ATSChecker = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf'))) {
      setFile(selectedFile);
      setAnalysis(null);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const loadUploadedDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('document_uploads')
        .select('id, filename, file_path, created_at')
        .eq('user_id', user.id)
        .eq('document_type', 'cv')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploadedDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const analyzeCV = async () => {
    if (!file || !user) {
      toast.error("Please upload a CV first");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Upload file to Supabase storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Store document metadata
      const { error: docError } = await supabase
        .from('document_uploads')
        .insert({
          user_id: user.id,
          filename: file.name,
          original_name: file.name,
          file_path: uploadData.path,
          document_type: 'cv',
          mime_type: file.type,
          file_size: file.size
        });

      if (docError) throw docError;

      // Call ATS checker function
      const { data, error } = await supabase.functions.invoke('ats-checker', {
        body: {
          filePath: uploadData.path,
          jobDescription
        }
      });

      if (error) throw error;

      // Store analysis result
      const analysisData = {
        user_id: user.id,
        file_path: uploadData.path,
        analysis_result: data
      };

      await supabase.from('ats_analyses').insert(analysisData);

      setAnalysis(data);
      toast.success("CV analysis completed!");
      loadUploadedDocuments();
    } catch (error) {
      console.error('ATS analysis error:', error);
      toast.error("Failed to analyze CV. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteDocument = async (document: UploadedDocument) => {
    if (!user) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('document_uploads')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      // Delete analysis if exists
      await supabase
        .from('ats_analyses')
        .delete()
        .eq('file_path', document.file_path);

      toast.success("Document deleted successfully");
      loadUploadedDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error("Failed to delete document");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ATS CV Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="cv-upload" className="block text-sm font-medium mb-2">
              Upload your CV (PDF only)
            </label>
            <div className="flex items-center gap-4">
              <input
                id="cv-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {file && <Badge variant="outline">{file.name}</Badge>}
            </div>
          </div>

          <div>
            <label htmlFor="job-description" className="block text-sm font-medium mb-2">
              Job Description (Optional)
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here for more targeted analysis..."
              className="w-full p-3 border rounded-lg"
              rows={3}
            />
          </div>

          <Button 
            onClick={analyzeCV}
            disabled={!file || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Analyzing CV...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Analyze CV
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {uploadedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Uploaded CVs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{doc.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded on {new Date(doc.analyzed_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDocument(doc)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ATS Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.score.overall)}`}>
                    {analysis.score.overall}%
                  </div>
                  <Badge className={getScoreBadge(analysis.score.overall)}>Overall</Badge>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(analysis.score.keywords)}`}>
                    {analysis.score.keywords}%
                  </div>
                  <p className="text-sm text-muted-foreground">Keywords</p>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(analysis.score.formatting)}`}>
                    {analysis.score.formatting}%
                  </div>
                  <p className="text-sm text-muted-foreground">Formatting</p>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(analysis.score.sections)}`}>
                    {analysis.score.sections}%
                  </div>
                  <p className="text-sm text-muted-foreground">Sections</p>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(analysis.score.readability)}`}>
                    {analysis.score.readability}%
                  </div>
                  <p className="text-sm text-muted-foreground">Readability</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {analysis.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Suggestions for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis.missingKeywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Missing Supply Chain Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Issues Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};