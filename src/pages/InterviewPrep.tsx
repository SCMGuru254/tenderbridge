import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useInterviewSessions } from '@/hooks/useInterviewSessions';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Question {
  id: string;
  text: string;
}

const InterviewPrep = () => {
  const { user, loading } = useAuth();
  const { 
    sessions, 
    currentSession, 
    responses, 
    loading: sessionLoading,
    setCurrentSession, 
    createSession, 
    deleteSession,
    saveResponse,
    completeSession,
    fetchSessions
  } = useInterviewSessions();
  
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (user) {
      const mockQuestions: Question[] = [
        { id: '1', text: 'Tell me about yourself.' },
        { id: '2', text: 'Why are you interested in this position?' },
        { id: '3', text: 'Describe your experience with supply chain management.' },
        { id: '4', text: 'How do you handle stressful situations?' },
        { id: '5', text: 'What are your strengths and weaknesses?' },
        { id: '6', text: 'Where do you see yourself in 5 years?' },
        { id: '7', text: 'Describe a time you failed and what you learned.' },
        { id: '8', text: 'How do you stay updated with industry trends?' },
        { id: '9', text: 'What is your expected salary?' },
        { id: '10', text: 'Do you have any questions for me?' }
      ];
      setAvailableQuestions(mockQuestions);
    }
  }, [user]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isPlaying && currentQuestion) {
      setQuestionTimer(60);
      intervalId = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev > 0) return prev - 1;
          if (intervalId) clearInterval(intervalId);
          setIsPlaying(false);
          return 0;
        });
      }, 1000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, currentQuestion]);

  const startSession = async () => {
    if (!sessionName || !position || !company) {
      toast.error('Please fill in all session details.');
      return;
    }

    const newSession = await createSession({
      session_name: sessionName,
      position,
      company,
      difficulty
    });

    if (newSession) {
      setCurrentSession(newSession);
      toast.success('Session started!');
      nextQuestion();
    } else {
      toast.error('Failed to start session.');
    }
  };

  const deleteCurrentSession = async () => {
    if (!currentSession) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this session? All progress will be lost.');
    if (!confirmDelete) return;

    const success = await deleteSession(currentSession.id);
    if (success) {
      toast.success('Session deleted.');
      setCurrentSession(null);
    } else {
      toast.error('Failed to delete session.');
    }
  };

  const nextQuestion = () => {
    if (!currentSession || availableQuestions.length === 0) return;

    const answeredCount = responses.filter(r => r.session_id === currentSession.id).length;
    if (answeredCount >= 10) {
      toast.message('Session completed! Please submit to get your score.');
      setIsPlaying(false);
      return;
    }

    const nextIndex = answeredCount % availableQuestions.length;
    setCurrentQuestion(availableQuestions[nextIndex]);
    setUserAnswer('');
    setAiFeedback('');
    setIsPlaying(true);
  };

  const pauseSession = () => {
    setIsPlaying(false);
  };

  const restartSession = () => {
    setUserAnswer('');
    setAiFeedback('');
    setIsPlaying(true);
    setQuestionTimer(60);
  };

  const submitAnswer = async () => {
    if (!currentSession || !currentQuestion) return;

    const aiScore = Math.floor(Math.random() * 5) + 1;
    const feedback = `AI Feedback: Your answer was ${aiScore > 3 ? 'good' : 'okay'}. Consider focusing on specific examples.`;

    const savedResponse = await saveResponse({
      question: currentQuestion.text,
      user_answer: userAnswer,
      ai_feedback: feedback,
      score: aiScore
    });

    if (savedResponse) {
      setAiFeedback(feedback);
      setScore(prevScore => prevScore + aiScore);
      toast.success('Answer submitted!');
      setIsPlaying(false);
    } else {
      toast.error('Failed to submit answer.');
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    const confirmEnd = window.confirm('Are you sure you want to end this session?');
    if (!confirmEnd) return;

    const success = await completeSession(currentSession.id, score);
    if (success) {
      toast.success('Session ended and score saved!');
      setCurrentSession(null);
      setScore(0);
    } else {
      toast.error('Failed to end session.');
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Interview Preparation</h1>
      <p className="text-muted-foreground">Practice your interview skills with AI feedback.</p>

      {!currentSession ? (
        <Card>
          <CardHeader>
            <CardTitle>Start a New Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="session-name">Session Name</Label>
              <Input
                id="session-name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g., Supply Chain Manager Interview"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g., Supply Chain Manager"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., TechCorp Inc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={startSession}>
              <Plus className="mr-2 h-4 w-4" />
              Start Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{currentSession.session_name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {currentSession.position} at {currentSession.company} ({currentSession.difficulty})
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Question {responses.length + 1}</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Time Left: {questionTimer}s</Badge>
                    {isPlaying ? (
                      <Button variant="outline" size="icon" onClick={pauseSession}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="icon" onClick={restartSession}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-lg">{currentQuestion.text}</p>
                <Textarea
                  placeholder="Your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={!isPlaying}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="secondary" 
                    onClick={submitAnswer} 
                    disabled={!isPlaying || !userAnswer}
                  >
                    Submit Answer
                  </Button>
                  <Button onClick={nextQuestion} disabled={isPlaying}>
                    Next Question
                  </Button>
                </div>
                {aiFeedback && (
                  <div className="mt-4 p-4 border rounded-md bg-secondary text-secondary-foreground">
                    <p className="font-semibold">AI Feedback:</p>
                    <p>{aiFeedback}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Session paused or completed.</p>
                {responses.length >= 10 && (
                  <p className="text-sm mt-2">Click "End Session" to submit your answers and get your score!</p>
                )}
              </div>
            )}
            <div className="flex justify-between">
              <Button variant="destructive" onClick={deleteCurrentSession}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Session
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={fetchSessions}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button onClick={endSession} disabled={responses.length < 1}>
                  End Session
                </Button>
              </div>
            </div>
            {currentSession.score !== null && (
              <div className="mt-4 p-4 border rounded-md bg-accent text-accent-foreground">
                <p className="font-semibold">Final Score:</p>
                <p className="text-2xl">{score} / 50</p>
                <Badge variant={score > 40 ? 'default' : score > 30 ? 'secondary' : 'destructive'}>
                  {score > 40 ? 'Excellent' : score > 30 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="border rounded-md p-3 cursor-pointer hover:bg-accent"
                  onClick={() => setCurrentSession(session)}
                >
                  <h3 className="font-semibold">{session.session_name}</h3>
                  <p className="text-sm text-muted-foreground">{session.position} at {session.company}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {session.status === 'completed' && (
                      <>
                        {session.score !== null ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-muted-foreground">Score: {session.score}</span>
                          </>
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </>
                    )}
                    {session.status === 'active' && <Clock className="h-5 w-5 text-blue-500" />}
                    <Badge variant="outline">{session.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewPrep;
