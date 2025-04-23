
import DocumentForm from "@/components/document-generator/DocumentForm";

interface DocumentGeneratorFormProps {
  onDocumentGenerated: (url: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  selectedTemplate: string | null;
}

const DocumentGeneratorForm = ({
  onDocumentGenerated,
  isGenerating,
  setIsGenerating,
  selectedTemplate
}: DocumentGeneratorFormProps) => {
  return (
    <DocumentForm 
      onDocumentGenerated={onDocumentGenerated} 
      isGenerating={isGenerating}
      setIsGenerating={setIsGenerating}
      selectedTemplate={selectedTemplate}
    />
  );
};

export default DocumentGeneratorForm;
