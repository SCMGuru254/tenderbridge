
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap, Send } from "lucide-react";

interface CareerAdvice {
  id: string;
  title: string;
  description: string;
  category: string;
  relevanceScore: number;
}

const AgentCareerAdvisor = () => {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [advice, setAdvice] = useState<{
    advice?: string[];
    skillRecommendations?: string[];
    careerPath?: string[];
    nextSteps?: string[];
  }>({
    advice: [
      "Consider developing data analytics skills for supply chain optimization",
      "Build expertise in sustainability and green logistics practices",
      "Gain experience with supply chain management software and ERP systems"
    ],
    skillRecommendations: [
      "SQL & Data Analysis",
      "SAP/Oracle ERP",
      "Lean Six Sigma",
      "Python/R Programming",
      "Sustainability Practices"
    ],
    careerPath: [
      "Supply Chain Analyst",
      "Senior Supply Chain Specialist",
      "Supply Chain Manager",
      "Director of Operations",
      "VP of Supply Chain"
    ],
    nextSteps: [
      "Complete a supply chain certification (APICS/SCOR)",
      "Network with industry professionals on LinkedIn",
      "Apply for analyst positions to gain hands-on experience"
    ]
  });

  const handleSubmitQuery = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    // In a real implementation, this would call the AI agent service
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate updated advice based on query
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Career Advice Agent
          </CardTitle>
          <CardDescription>Get personalized guidance for your supply chain career</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="career-query">Ask about your career goals</Label>
            <Textarea
              id="career-query"
              placeholder="E.g., How can I transition from logistics to supply chain management?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleSubmitQuery}
            disabled={isProcessing || !query.trim()}
            className="w-full"
          >
            {isProcessing ? (
              "Analyzing..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Get Career Advice
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Career Guidance</CardTitle>
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
    </div>
  );
};

export default AgentCareerAdvisor;
