
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Crown } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  preview?: string;
}

interface CVTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const CVTemplateSelector = ({ selectedTemplate, onTemplateSelect }: CVTemplateSelectorProps) => {
  const templates: Template[] = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, contemporary design perfect for supply chain roles',
      isPremium: false
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated layout for senior management positions',
      isPremium: true
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple, ATS-friendly format that highlights content',
      isPremium: false
    },
    {
      id: 'creative',
      name: 'Creative Professional',
      description: 'Distinctive design for innovative supply chain roles',
      isPremium: true
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose a Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {template.name}
                </CardTitle>
                {template.isPremium && (
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CVTemplateSelector;
