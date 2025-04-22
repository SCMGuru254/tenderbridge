
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Download, FileText, User, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DocumentPreview from "@/components/document-generator/DocumentPreview";
import CVTemplateSelector from "@/components/document-generator/CVTemplateSelector";
import { useUser } from "@/hooks/useUser";
import { languages } from "@/data/languages";

export default function DocumentGenerator() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("cv");
  const [generatedDocUrl, setGeneratedDocUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [templateId, setTemplateId] = useState("modern");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch user profile for pre-filling data if available
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
  
  // Pre-fill form with profile data when available
  useEffect(() => {
    if (profile) {
      if (profile.position) setJobTitle(profile.position);
      if (profile.bio) setExperience(profile.bio);
    }
  }, [profile]);
  
  // Handle file upload for existing CV/cover letter
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Only accept PDF, DOCX, or TXT files
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOCX, or TXT files are accepted");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // In a real implementation, this would extract text from the document
      // using a document parsing API, then use that for AI enhancement
      
      // Mock document parsing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set a mock URL for demonstration purposes
      setGeneratedDocUrl(URL.createObjectURL(file));
      
      toast.success("Document uploaded and ready for enhancement");
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error("Failed to process document");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate document using AI
  const handleGenerateDocument = async () => {
    if (!jobTitle || !experience || !skills) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // For demonstration, we'll simulate an API call
      // In a real implementation, this would call the AI document generation function
      
      // Mock generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock document URL
      // In a real implementation, this would be a URL to the generated document
      setGeneratedDocUrl(`https://example.com/generated-${activeTab}-${Date.now()}.pdf`);
      
      // In a real implementation, save document info to database with expiration date
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1); // 24 hours from now
      
      if (user?.id) {
        try {
          await supabase.from('generated_documents').insert({
            user_id: user.id,
            document_type: activeTab,
            document_url: generatedDocUrl,
            expiration_date: expirationDate.toISOString(),
            language: selectedLanguage,
            template_id: templateId
          });
        } catch (error) {
          console.error("Error saving document info:", error);
          // Non-critical error, so continue
        }
      }
      
      toast.success(`Your ${activeTab.toUpperCase()} has been generated!`);
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Failed to generate document");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Language selection handler
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Document Generator</h1>
      <p className="text-muted-foreground mb-8">
        Create professional CVs and cover letters tailored to your target job
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>AI Document Generator</CardTitle>
              <CardDescription>
                Generate professional documents optimized for job applications
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="cv" className="flex-1">CV / Resume</TabsTrigger>
                  <TabsTrigger value="cover-letter" className="flex-1">Cover Letter</TabsTrigger>
                </TabsList>
                
                <div className="mb-6">
                  <Label htmlFor="language">Language</Label>
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <TabsContent value="cv">
                  <div className="space-y-4">
                    <div className="mb-4">
                      <Label htmlFor="cv-template">CV Template</Label>
                      <CVTemplateSelector 
                        value={templateId} 
                        onChange={setTemplateId}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="job-title">Job Title or Position</Label>
                      <Input 
                        id="job-title" 
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Supply Chain Manager"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experience">
                        Professional Experience
                        <span className="text-destructive"> *</span>
                      </Label>
                      <Textarea 
                        id="experience" 
                        value={experience} 
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Briefly describe your work experience..."
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">
                        Key Skills
                        <span className="text-destructive"> *</span>
                      </Label>
                      <Textarea 
                        id="skills" 
                        value={skills} 
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="List your key skills, separated by commas..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="text-muted-foreground text-sm">
                      <p>* Required fields</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cover-letter">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input 
                        id="job-title" 
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Supply Chain Manager"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experience">
                        Your Experience
                        <span className="text-destructive"> *</span>
                      </Label>
                      <Textarea 
                        id="experience" 
                        value={experience} 
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Briefly describe your relevant experience..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">
                        Key Skills
                        <span className="text-destructive"> *</span>
                      </Label>
                      <Textarea 
                        id="skills" 
                        value={skills} 
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="List your relevant skills..."
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="job-description">
                        Job Description
                      </Label>
                      <Textarea 
                        id="job-description" 
                        value={jobDescription} 
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description to customize your cover letter..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="text-muted-foreground text-sm">
                      <p>* Required fields</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex-col space-y-4">
              <Button 
                className="w-full" 
                onClick={handleGenerateDocument}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate {activeTab === "cv" ? "CV" : "Cover Letter"}
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  Or upload your existing document for AI enhancement
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                >
                  <User className="mr-2 h-4 w-4" />
                  Upload Existing Document
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".pdf,.docx,.txt" 
                  className="hidden" 
                />
              </div>
              
              <div className="text-center text-xs text-muted-foreground pt-4 border-t w-full">
                <Badge variant="secondary" className="mb-2">Important</Badge>
                <p>
                  Documents are automatically deleted after 24 hours. 
                  Please download your file to save it.
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-7">
          <DocumentPreview 
            documentUrl={generatedDocUrl} 
            documentType={activeTab} 
            isLoading={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
