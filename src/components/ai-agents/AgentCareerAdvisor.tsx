
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
            <ScrollArea className="h-[500px]">
              <div className="space-y-6">
                {advice.advice && advice.advice.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Badge variant="default">General Advice</Badge>
                    </h4>
                    <ul className="space-y-2">
                      {advice.advice.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground border-l-2 border-blue-200 pl-3">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {advice.skillRecommendations && advice.skillRecommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Badge variant="secondary">Skill Recommendations</Badge>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {advice.skillRecommendations.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {advice.careerPath && advice.careerPath.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Badge variant="default">Suggested Career Path</Badge>
                    </h4>
                    <div className="space-y-2">
                      {advice.careerPath.map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {advice.nextSteps && advice.nextSteps.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Badge variant="destructive">Next Steps</Badge>
                    </h4>
                    <ul className="space-y-2">
                      {advice.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm text-muted-foreground border-l-2 border-green-200 pl-3">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentCareerAdvisor;
