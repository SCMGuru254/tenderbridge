
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileProcessed: (url: string) => void;
  isProcessing: boolean;
}

const FileUpload = ({ onFileProcessed, isProcessing }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOCX, or TXT files are accepted");
      return;
    }
    
    try {
      const url = URL.createObjectURL(file);
      onFileProcessed(url);
      toast.success("Document uploaded and ready for enhancement");
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error("Failed to process document");
    }
  };

  return (
    <div className="text-center">
      <p className="text-muted-foreground">
        Or upload your existing document for AI enhancement
      </p>
      <Button 
        variant="outline" 
        className="mt-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
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
  );
};

export default FileUpload;
