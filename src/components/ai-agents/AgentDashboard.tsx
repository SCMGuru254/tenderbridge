
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AIAgent, AGENT_ROLES } from "@/services/aiAgents";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import AgentNewsAnalyzer from "./AgentNewsAnalyzer";
import AgentJobMatcher from "./AgentJobMatcher";
import AgentCareerAdvisor from "./AgentCareerAdvisor";
import AgentSocialMedia from "./AgentSocialMedia";

export function AgentDashboard() {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="mx-auto max-w-6xl p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">AI Assistant Agents</h1>
      <p className="text-muted-foreground mb-6">
        Specialized AI assistants to help with your supply chain career and job search
      </p>

      <Tabs defaultValue="news" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="news">
            News Analyzer
          </TabsTrigger>
          <TabsTrigger value="jobs">
            Job Matcher
          </TabsTrigger>
          <TabsTrigger value="career">
            Career Advisor
          </TabsTrigger>
          <TabsTrigger value="social">
            Social Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <AgentNewsAnalyzer />
        </TabsContent>

        <TabsContent value="jobs">
          <AgentJobMatcher />
        </TabsContent>

        <TabsContent value="career">
          <AgentCareerAdvisor />
        </TabsContent>

        <TabsContent value="social">
          <AgentSocialMedia />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AgentDashboard;
