
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentDashboard from "@/components/ai-agents/AgentDashboard";
import { AgentJobMatcher } from "@/components/ai-agents/AgentJobMatcher";
import { AgentCareerAdvisor } from "@/components/ai-agents/AgentCareerAdvisor";
import { AgentNewsAnalyzer } from "@/components/ai-agents/AgentNewsAnalyzer";
import { Bot, Briefcase, TrendingUp, Users } from "lucide-react";

export default function AIAgents() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
        <p className="text-muted-foreground">
          Leverage AI-powered tools for job matching, career guidance, and market insights
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="job-matcher" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Matcher
          </TabsTrigger>
          <TabsTrigger value="career-advisor" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Career Advisor
          </TabsTrigger>
          <TabsTrigger value="news-analyzer" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            News Analyzer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <AgentDashboard />
        </TabsContent>
        
        <TabsContent value="job-matcher" className="mt-6">
          <AgentJobMatcher />
        </TabsContent>
        
        <TabsContent value="career-advisor" className="mt-6">
          <AgentCareerAdvisor />
        </TabsContent>
        
        <TabsContent value="news-analyzer" className="mt-6">
          <AgentNewsAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
