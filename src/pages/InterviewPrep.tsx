
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Brain, 
  BookOpen, 
  Star,
  Clock,
  Target,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const InterviewPrep = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newSession, setNewSession] = useState({
    session_name: '',
    company: '',
    position: '',
    difficulty: 'medium'
  });

  useEffect(() => {
    if (user) {
      loadSessions();
      loadQuestions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(10);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const createSession = async () => {
    if (!user) {
      toast.error('Please sign in to create interview sessions');
      return;
    }

    try {
      const { error } = await supabase
        .from('interview_sessions')
        .insert({
          ...newSession,
          user_id: user.id
        });

      if (error) throw error;

      toast.success('Interview session created!');
      setNewSession({
        session_name: '',
        company: '',
        position: '',
        difficulty: 'medium'
      });
      loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          Interview Preparation
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Practice supply chain interview questions, create mock interview sessions, and prepare for your dream job.
        </p>
      </div>

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="practice">Practice Questions</TabsTrigger>
          <TabsTrigger value="mock-interview">Mock Interview</TabsTrigger>
          <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Popular Interview Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card key={question.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{question.company_name} - {question.position}</h3>
                        <Badge variant={question.difficulty === 'easy' ? 'secondary' : question.difficulty === 'medium' ? 'default' : 'destructive'}>
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{question.question}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {question.upvotes} upvotes
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Practice Answer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mock-interview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Create Mock Interview Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="session_name">Session Name</Label>
                  <Input
                    id="session_name"
                    value={newSession.session_name}
                    onChange={(e) => setNewSession({...newSession, session_name: e.target.value})}
                    placeholder="Supply Chain Manager Interview Prep"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Target Company</Label>
                  <Input
                    id="company"
                    value={newSession.company}
                    onChange={(e) => setNewSession({...newSession, company: e.target.value})}
                    placeholder="Safaricom, Unilever, etc."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newSession.position}
                    onChange={(e) => setNewSession({...newSession, position: e.target.value})}
                    placeholder="Supply Chain Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select 
                    value={newSession.difficulty} 
                    onValueChange={(value) => setNewSession({...newSession, difficulty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={createSession} className="w-full md:w-auto">
                <Play className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                My Interview Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first mock interview session to start practicing.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <Card key={session.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{session.session_name}</h3>
                          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {session.company} - {session.position}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Difficulty: {session.difficulty}</span>
                          <span>Score: {session.score || 0}/100</span>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewPrep;
