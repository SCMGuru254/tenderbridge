
import { useState } from "react";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AIAgent, AGENT_ROLES } from "@/services/agents";
import { useToast } from "@/hooks/use-toast";

export default function AgentCareerAdvisor() {
  const [currentRole, setCurrentRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [interests, setInterests] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const careerAgent = new AIAgent(AGENT_ROLES.CAREER_ADVISOR);

  const handleGetAdvice = async () => {
    if (!currentRole.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your current role",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const careerQuery = {
        currentRole,
        yearsExperience: parseInt(yearsExperience) || 0,
        interests: interests.split(",").map(i => i.trim()).filter(i => i)
      };
      
      const result = await careerAgent.analyzeCareerPath(careerQuery);
      setAdvice(result);
      
      if (!result) {
        throw new Error("Failed to generate career advice");
      }
      
    } catch (error) {
      console.error("Career advice error:", error);
      toast({
        title: "Process failed",
        description: "Unable to generate career advice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supply Chain Career Advisor</CardTitle>
        <CardDescription>
          Get personalized career guidance for your supply chain career
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="currentRole">Current Role</Label>
          <Input 
            id="currentRole"
            placeholder="e.g., Logistics Coordinator" 
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="yearsExperience">Years of Experience</Label>
          <Input 
            id="yearsExperience"
            type="number" 
            placeholder="e.g., 3" 
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="interests">Career Interests (comma separated)</Label>
          <Input 
            id="interests"
            placeholder="e.g., supply chain analytics, sustainability" 
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleGetAdvice}
          disabled={isProcessing || !currentRole.trim()}
          className="w-full"
        >
          {isProcessing ? "Generating Advice..." : "Get Career Advice"}
        </Button>
        
        {advice && (
          <div className="mt-6 space-y-2">
            <Separator />
            <h3 className="font-medium">Career Advice:</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {advice}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
