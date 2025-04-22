
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { languages } from "@/data/languages";
import { supabase } from "@/integrations/supabase/client";
import CVTemplateSelector from "./CVTemplateSelector";

interface DocumentFormProps {
  onDocumentGenerated: (url: string) => void;
}

const DocumentForm = ({ onDocumentGenerated }: DocumentFormProps) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("cv");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [templateId, setTemplateId] = useState("modern");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");

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

  useEffect(() => {
    if (profile) {
      if (profile.position) setJobTitle(profile.position);
      if (profile.bio) setExperience(profile.bio);
    }
  }, [profile]);

  const handleGenerateDocument = async () => {
    if (!jobTitle || !experience || !skills) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await supabase.functions.invoke('document-generator', {
        body: {
          documentType: activeTab,
          language: selectedLanguage,
          templateId,
          jobTitle,
          experience,
          skills,
          jobDescription: jobDescription || ""
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate document");
      }

      if (response.data && response.data.documentUrl) {
        onDocumentGenerated(response.data.documentUrl);
        toast.success(`Your ${activeTab.toUpperCase()} has been generated!`);
      } else {
        throw new Error("No document URL in response");
      }
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Failed to generate document");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="cv" className="flex-1">CV / Resume</TabsTrigger>
          <TabsTrigger value="cover-letter" className="flex-1">Cover Letter</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <Label htmlFor="language">Language</Label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea 
                id="job-description" 
                value={jobDescription} 
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description to customize your cover letter..."
                rows={4}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4">
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
      </div>
    </div>
  );
};

export default DocumentForm;
