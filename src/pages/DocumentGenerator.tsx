
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DocumentPreview from "@/components/document-generator/DocumentPreview";
import DocumentForm from "@/components/document-generator/DocumentForm";
import FileUpload from "@/components/document-generator/FileUpload";

export default function DocumentGenerator() {
  const [generatedDocUrl, setGeneratedDocUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDocumentGenerated = (url: string) => {
    setGeneratedDocUrl(url);
  };

  const handleFileProcessed = (url: string) => {
    setGeneratedDocUrl(url);
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
              <DocumentForm onDocumentGenerated={handleDocumentGenerated} />
            </CardContent>
            
            <CardFooter className="flex-col space-y-4">
              <FileUpload 
                onFileProcessed={handleFileProcessed}
                isProcessing={isGenerating}
              />
              
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
            documentType="cv"
            isLoading={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
