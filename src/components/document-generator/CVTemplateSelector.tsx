
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CVTemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const templates = [
  { id: "modern", name: "Modern", description: "Clean and professional design with subtle accents" },
  { id: "classic", name: "Classic", description: "Traditional layout perfect for conservative industries" },
  { id: "creative", name: "Creative", description: "Unique design to stand out from the crowd" },
  { id: "executive", name: "Executive", description: "Sophisticated design for senior positions" },
  { id: "minimal", name: "Minimal", description: "Simple and focused on content without distractions" },
];

const CVTemplateSelector = ({ value, onChange }: CVTemplateSelectorProps) => {
  return (
    <ScrollArea className="h-[150px] rounded-md border">
      <div className="p-4 space-y-2">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all ${
              template.id === value 
                ? 'bg-primary/10 border-primary/50' 
                : 'hover:bg-secondary/50'
            }`}
            onClick={() => onChange(template.id)}
          >
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
              <div className={`w-4 h-4 rounded-full ${
                template.id === value 
                  ? 'bg-primary' 
                  : 'border border-muted-foreground'
              }`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CVTemplateSelector;
