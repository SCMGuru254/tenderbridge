
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Brain, 
  BookOpen, 
  Clock,
  Target,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { InterviewQuestionComments } from '@/components/interview/InterviewQuestionComments';

interface InterviewQuestion {
  id: string;
  company_name: string;
  position: string;
  question: string;
  difficulty: string;
  upvotes: number;
  downvotes: number;
  is_anonymous: boolean;
  user_id: string | null;
}

interface InterviewSession {
  id: string;
  session_name: string;
  company: string;
  position: string;
  difficulty: string;
  status: string;
  score: number;
}

const InterviewPrep = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    company_name: '',
    position: '',
    question: '',
    difficulty: 'medium',
    is_anonymous: false
  });
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
        .limit(20);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const submitQuestion = async () => {
    if (!user) {
      toast.error('Please sign in to submit a question');
      return;
    }
    if (!newQuestion.question.trim() || !newQuestion.company_name.trim() || !newQuestion.position.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const { error } = await supabase
        .from('interview_questions')
        .insert({
          ...newQuestion,
          user_id: user.id
        });
      if (error) throw error;
      toast.success('Question submitted!');
      setNewQuestion({ company_name: '', position: '', question: '', difficulty: 'medium', is_anonymous: false });
      // Reset form
      loadQuestions();
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question');
    }
  };

  const handleVote = async (questionId: string, type: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }
    try {
      const field = type === 'up' ? 'upvotes' : 'downvotes';
      const question = questions.find(q => q.id === questionId);
      if (!question) return;
      
      const { error } = await supabase
        .from('interview_questions')
        .update({ [field]: (question[field === 'upvotes' ? 'upvotes' : 'downvotes'] || 0) + 1 })
        .eq('id', questionId);
      if (error) throw error;
      loadQuestions();
    } catch (error) {
      console.error('Error voting:', error);
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="practice">Practice Questions</TabsTrigger>
          <TabsTrigger value="submit">Submit Question</TabsTrigger>
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
                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                    <p className="text-muted-foreground mb-4">Be the first to submit a supply chain interview question!</p>
                    <Button variant="outline" onClick={() => { const el = document.querySelector('[data-value="submit"]'); if(el instanceof HTMLElement) el.click(); }}>
                      <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                  </div>
                ) : (
                  questions.map((question) => (
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
                          <Button variant="ghost" size="sm" onClick={() => handleVote(question.id, 'up')}>
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {question.upvotes || 0}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleVote(question.id, 'down')}>
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {question.downvotes || 0}
                          </Button>
                        </div>
                        <InterviewQuestionComments questionId={question.id} />
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Submit an Interview Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Please <a href="/auth" className="text-primary hover:underline">sign in</a> to submit questions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="q_company">Company Name *</Label>
                      <Input id="q_company" value={newQuestion.company_name} onChange={(e) => setNewQuestion({...newQuestion, company_name: e.target.value})} placeholder="e.g., Safaricom, DHL" />
                    </div>
                    <div>
                      <Label htmlFor="q_position">Position *</Label>
                      <Input id="q_position" value={newQuestion.position} onChange={(e) => setNewQuestion({...newQuestion, position: e.target.value})} placeholder="e.g., Supply Chain Manager" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="q_question">Interview Question *</Label>
                    <Textarea id="q_question" value={newQuestion.question} onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})} placeholder="What question were you asked?" className="min-h-[100px]" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="q_difficulty">Difficulty</Label>
                      <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={newQuestion.is_anonymous} onChange={(e) => setNewQuestion({...newQuestion, is_anonymous: e.target.checked})} className="rounded" />
                        Post anonymously
                      </label>
                    </div>
                  </div>
                  <Button onClick={submitQuestion} className="w-full md:w-auto">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Question
                  </Button>
                </div>
              )}
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
