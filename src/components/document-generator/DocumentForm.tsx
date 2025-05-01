
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentFormProps {
  onDocumentGenerated: (url: string) => void;
  selectedTemplate: string | null;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const DocumentForm = ({
  onDocumentGenerated,
  selectedTemplate,
  isGenerating,
  setIsGenerating
}: DocumentFormProps) => {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [documentType, setDocumentType] = useState<"cv" | "cover-letter">("cv");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !experience) {
      toast({
        title: "Missing information",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get template from selected template or default to basic
      const template = selectedTemplate || "basic";
      
      const { data, error } = await supabase.functions.invoke("document-generator", {
        body: {
          name,
          experience,
          education,
          skills,
          documentType,
          template
        }
      });
      
      if (error) throw error;
      
      if (data?.documentUrl) {
        onDocumentGenerated(data.documentUrl);
        toast({
          title: "Document generated",
          description: "Your document has been successfully created.",
        });
      } else {
        throw new Error("No document URL returned");
      }
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="documentType">Document Type</Label>
        <RadioGroup
          id="documentType"
          value={documentType}
          onValueChange={(value) => setDocumentType(value as "cv" | "cover-letter")}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cv" id="cv" />
            <Label htmlFor="cv">CV/Resume</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cover-letter" id="cover-letter" />
            <Label htmlFor="cover-letter">Cover Letter</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <Label htmlFor="experience">Professional Experience <span className="text-red-500">*</span></Label>
        <Textarea
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
          placeholder="Briefly describe your work experience"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="education">Education</Label>
        <Textarea
          id="education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="List your educational background"
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Textarea
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="List your relevant skills"
          rows={2}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : "Generate Document"}
      </Button>
    </form>
  );
};

export default DocumentForm;
