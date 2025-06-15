
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  FileText, 
  Search, 
  MessageSquare,
  Briefcase,
  Star,
  TrendingUp
} from 'lucide-react';
import { ATSChecker } from '@/components/ats/ATSChecker';
import { JobMatcher } from '@/components/jobs/JobMatcher';
import JobMatchingChat from '@/components/JobMatchingChat';
import AgentJobMatcher from '@/components/ai-agents/AgentJobMatcher';

const AIAgents = () => {
  const agents = [
    {
      id: 'ats-checker',
      name: 'ATS Resume Checker',
      description: 'Optimize your resume for Applicant Tracking Systems',
      icon: FileText,
      status: 'active',
      category: 'Resume Optimization'
    },
    {
      id: 'job-matcher',
      name: 'AI Job Matcher',
      description: 'Find jobs that match your skills and preferences',
      icon: Search,
      status: 'active',
      category: 'Job Matching'
    },
    {
      id: 'job-chat',
      name: 'Job Search Assistant',
      description: 'Chat with AI to find relevant job opportunities',
      icon: MessageSquare,
      status: 'active',
      category: 'Job Discovery'
    },
    {
      id: 'resume-analyzer',
      name: 'Resume-Job Analyzer',
      description: 'Analyze how well your resume matches specific jobs',
      icon: TrendingUp,
      status: 'active',
      category: 'Career Analysis'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Career Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Powerful AI tools to enhance your job search and career development in supply chain management.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Card key={agent.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
                    <Badge variant="secondary">{agent.category}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ats-checker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ats-checker">ATS Checker</TabsTrigger>
          <TabsTrigger value="job-matcher">Job Matcher</TabsTrigger>
          <TabsTrigger value="job-chat">Job Chat</TabsTrigger>
          <TabsTrigger value="resume-analyzer">Resume Analyzer</TabsTrigger>
        </TabsList>

        <TabsContent value="ats-checker">
          <ATSChecker />
        </TabsContent>

        <TabsContent value="job-matcher">
          <JobMatcher />
        </TabsContent>

        <TabsContent value="job-chat">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Job Search Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <JobMatchingChat />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume-analyzer">
          <AgentJobMatcher />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgents;
