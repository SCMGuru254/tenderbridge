import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, FileText, Search, TrendingUp, Users, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import AgentDashboard from "@/components/ai-agents/AgentDashboard";
import AgentJobMatcher from "@/components/ai-agents/AgentJobMatcher";
import AgentCareerAdvisor from "@/components/ai-agents/AgentCareerAdvisor";

const AIAgents = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const agents = [
    {
      id: "job-matcher",
      name: "Job Matcher",
      description: "Find jobs that match your skills and preferences",
      icon: Search,
      color: "bg-blue-500",
      features: ["Smart matching", "Salary insights", "Skills analysis"],
      component: <AgentJobMatcher />
    },
    {
      id: "ats-checker",
      name: "ATS Checker",
      description: "Optimize your resume for applicant tracking systems",
      icon: FileText,
      color: "bg-green-500",
      features: ["Resume scanning", "ATS optimization", "Keyword analysis"],
      component: <div className="p-6 text-center">ATS Checker coming soon...</div>
    },
    {
      id: "career-advisor",
      name: "Career Advisor",
      description: "Get personalized career guidance and growth strategies",
      icon: TrendingUp,
      color: "bg-purple-500",
      features: ["Career planning", "Skill recommendations", "Growth tracking"],
      component: <AgentCareerAdvisor />
    },
    {
      id: "resume-analyzer",
      name: "Resume Analyzer",
      description: "Analyze and improve your resume with AI insights",
      icon: Bot,
      color: "bg-orange-500",
      features: ["Content analysis", "Improvement suggestions", "Format optimization"],
      component: <div className="p-6 text-center">Resume Analyzer coming soon...</div>
    },
    {
      id: "interview-coach",
      name: "Interview Coach",
      description: "Practice interviews with AI-powered feedback",
      icon: Users,
      color: "bg-red-500",
      features: ["Mock interviews", "Real-time feedback", "Question bank"],
      component: <div className="p-6 text-center">Interview Coach coming soon...</div>
    },
    {
      id: "chat-assistant",
      name: "Chat Assistant",
      description: "Get instant answers to your career questions",
      icon: MessageSquare,
      color: "bg-indigo-500",
      features: ["24/7 availability", "Instant responses", "Career guidance"],
      component: <div className="p-6 text-center">Chat Assistant coming soon...</div>
    }
  ];

  const totalSlides = agents.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentSlideAgents = () => {
    return [agents[currentSlide]];
  };

  if (selectedAgent) {
    const agent = agents.find(a => a.id === selectedAgent);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedAgent(null)}
            className="mb-4"
          >
            ← Back to AI Agents
          </Button>
          <h1 className="text-3xl font-bold mb-2">{agent?.name}</h1>
          <p className="text-muted-foreground">{agent?.description}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border">
          {agent?.component}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI-Powered Career Tools</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Leverage artificial intelligence to accelerate your supply chain career
        </p>
      </div>

      <Tabs defaultValue="agents" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents" className="mt-6">
          {/* Mobile Carousel */}
          <div className="block md:hidden">
            <div className="relative mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">AI Assistants</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                    {currentSlide + 1} / {totalSlides}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextSlide}
                    disabled={currentSlide === totalSlides - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {getCurrentSlideAgents().map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <Card 
                      key={agent.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-3 rounded-lg ${agent.color} text-white flex-shrink-0`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg leading-tight">{agent.name}</CardTitle>
                            <CardDescription className="text-sm mt-1 leading-relaxed">
                              {agent.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {agent.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full">
                          Try {agent.name}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold mb-6">Choose Your AI Assistant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <Card 
                    key={agent.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-3 rounded-lg ${agent.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{agent.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription>{agent.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {agent.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">
                        Try {agent.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="dashboard" className="mt-6">
          <AgentDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgents;
