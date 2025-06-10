
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap } from "lucide-react";

interface CareerAdvice {
  id: string;
  title: string;
  description: string;
  category: string;
  relevanceScore: number;
}

const AgentCareerAdvisor = () => {
  const [adviceList] = useState<CareerAdvice[]>([
    {
      id: "1",
      title: "Upskill in Data Analytics",
      description: "Data analytics skills are in high demand in supply chain. Consider courses in SQL, Python, and Tableau.",
      category: "Skills",
      relevanceScore: 85
    },
    {
      id: "2",
      title: "Network with Industry Leaders",
      description: "Attend industry conferences and connect with leaders on LinkedIn to expand your network.",
      category: "Networking",
      relevanceScore: 78
    },
    {
      id: "3",
      title: "Certifications in Logistics",
      description: "Obtain certifications like CSCP or CLTD to demonstrate your expertise in logistics and supply chain.",
      category: "Certifications",
      relevanceScore: 92
    }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Career Advice
          </CardTitle>
          <CardDescription>Personalized guidance for your career path</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {adviceList.map((advice) => (
                <Card key={advice.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium">{advice.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {advice.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{advice.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCareerAdvisor;
