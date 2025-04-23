
import DocumentPreview from "@/components/document-generator/DocumentPreview";

interface DocumentPreviewSectionProps {
  documentUrl: string | null;
  isLoading: boolean;
  documentType: string;
}

const DocumentPreviewSection = ({
  documentUrl,
  isLoading,
  documentType,
}: DocumentPreviewSectionProps) => {
  return (
    <DocumentPreview
      documentUrl={documentUrl}
      documentType={documentType}
      isLoading={isLoading}
    />
  );
};

export default DocumentPreviewSection;
