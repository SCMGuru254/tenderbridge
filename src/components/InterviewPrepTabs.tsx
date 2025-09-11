import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Video, 
  Clock, 
  Star, 
  PlayCircle,
  CheckCircle2,
  Users
} from 'lucide-react';

interface InterviewSession {
  id: string;
  session_name: string;
  company: string;
  position: string;
  status: string;
  score: number;
  created_at: string;
}

const InterviewPrepTabs = () => {
  const [activeTab, setActiveTab] = useState('practice-questions');
  
  // Mock data for demonstration
  const practiceQuestions = [
    {
      id: 1,
      question: "Tell me about your experience with supply chain optimization.",
      difficulty: "Medium",
      category: "Supply Chain",
      answered: false
    },
    {
      id: 2,
      question: "How do you handle inventory management challenges?",
      difficulty: "Hard",
      category: "Inventory",
      answered: true
    },
    {
      id: 3,
      question: "Describe a time when you improved logistics efficiency.",
      difficulty: "Easy",
      category: "Logistics",
      answered: false
    }
  ];

  const mockSessions: InterviewSession[] = [
    {
      id: '1',
      session_name: 'Supply Chain Manager Practice',
      company: 'Kenya Airways',
      position: 'Supply Chain Manager',
      status: 'completed',
      score: 85,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2', 
      session_name: 'Logistics Coordinator Mock',
      company: 'Safaricom',
      position: 'Logistics Coordinator',
      status: 'in_progress',
      score: 0,
      created_at: '2024-01-20T14:00:00Z'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 pb-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Interview Preparation</h1>
        <p className="text-muted-foreground">
          Prepare for your next supply chain interview with AI-powered practice sessions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="practice-questions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Practice Questions
          </TabsTrigger>
          <TabsTrigger value="mock-interview" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Mock Interview
          </TabsTrigger>
          <TabsTrigger value="my-sessions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            My Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="practice-questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Practice Questions Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {practiceQuestions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">{question.category}</Badge>
                        {question.answered && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Answered
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant={question.answered ? "outline" : "default"} 
                      size="sm"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {question.answered ? 'Retry' : 'Practice'}
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Button variant="outline" className="w-full">
                  Load More Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mock-interview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                AI-Powered Mock Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Start Your Mock Interview</h3>
                <p className="text-muted-foreground mb-6">
                  Get personalized feedback from our AI interviewer trained on supply chain expertise
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button className="w-full">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Quick Interview
                  </Button>
                  <Button variant="outline" className="w-full">
                    Custom Setup
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Interview Features:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Real-time Feedback</p>
                      <p className="text-sm text-muted-foreground">Get instant scoring and tips</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Industry-Specific</p>
                      <p className="text-sm text-muted-foreground">Supply chain focused questions</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Interview Session History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Sessions Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your first mock interview to see your progress here
                  </p>
                  <Button onClick={() => setActiveTab('mock-interview')}>
                    Start Mock Interview
                  </Button>
                </div>
              ) : (
                mockSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{session.session_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.company} • {session.position}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        {session.score > 0 && (
                          <Badge variant="outline">
                            Score: {session.score}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {session.status === 'in_progress' && (
                          <Button size="sm">
                            Continue
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewPrepTabs;