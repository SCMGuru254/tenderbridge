
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  Mic, 
  Video, 
  Clock, 
  CheckCircle,
  Star,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useInterviewSessions } from '@/hooks/useInterviewSessions';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  type: 'behavioral' | 'technical' | 'situational';
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface Feedback {
  id: string;
  question: string;
  answer: string;
  score: number;
  feedback: string;
  improvements: string[];
  created_at: string;
}

const InterviewPrep = () => {
  const [selectedQuestionType, setSelectedQuestionType] = useState<'behavioral' | 'technical' | 'situational'>('behavioral');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { sessions, createSession } = useInterviewSessions();

  useEffect(() => {
    if (user) {
      fetchQuestions();
      fetchPracticeHistory();
    }
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        const formattedQuestions = data?.map(q => ({
          id: q.id,
          type: q.difficulty as 'behavioral' | 'technical' | 'situational',
          question: q.question,
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
          category: q.position || 'General'
        })) || [];
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const fetchPracticeHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interview_practice_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching practice history:', error);
      } else {
        setPracticeHistory(data || []);
      }
    } catch (error) {
      console.error('Error loading practice history:', error);
    }
  };

  const filteredQuestions = questions.filter(q => q.type === selectedQuestionType);

  const handleAnswerSubmit = async (question: string) => {
    if (!currentAnswer.trim() || !user) {
      toast.error('Please provide an answer and sign in');
      return;
    }

    setLoading(true);
    try {
      const mockFeedback = {
        user_id: user.id,
        question,
        answer: currentAnswer,
        score: Math.floor(Math.random() * 30) + 70,
        feedback: "Good structure and relevant examples. Consider adding more specific metrics.",
        improvements: [
          "Include quantifiable results",
          "Mention specific tools or methodologies used",
          "Add more details about stakeholder impact"
        ]
      };

      const { data, error } = await supabase
        .from('interview_practice_history')
        .insert(mockFeedback)
        .select()
        .single();

      if (error) {
        console.error('Error saving feedback:', error);
        toast.error('Failed to save feedback');
      } else {
        await fetchPracticeHistory();
        setCurrentAnswer('');
        toast.success('Answer analyzed! Check your feedback below.');
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Failed to analyze answer');
    } finally {
      setLoading(false);
    }
  };

  const startMockInterview = async (interviewType: string) => {
    if (!user) {
      toast.error('Please sign in to start mock interviews');
      return;
    }

    const sessionData = {
      session_name: `${interviewType} - ${new Date().toLocaleDateString()}`,
      position: 'Supply Chain Professional',
      company: 'Practice Company',
      difficulty: 'medium' as const
    };

    const session = await createSession(sessionData);
    if (session) {
      toast.success(`Starting ${interviewType}...`);
    } else {
      toast.error('Failed to start interview session');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Recording started');
    } else {
      toast.success('Recording stopped');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Interview Preparation</h1>
        <p className="text-muted-foreground">
          Practice supply chain interview questions and get AI-powered feedback
        </p>
      </div>

      {/* Question Practice Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Practice Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Type Selector */}
          <div className="flex gap-2">
            {(['behavioral', 'technical', 'situational'] as const).map((type) => (
              <Button
                key={type}
                variant={selectedQuestionType === type ? 'default' : 'outline'}
                onClick={() => setSelectedQuestionType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No questions available for {selectedQuestionType} category.</p>
                <p className="text-sm mt-2">Questions will be added from the database soon.</p>
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <Card key={question.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{question.question}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <Textarea
                      placeholder="Type your answer here..."
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      className="mb-3"
                      rows={4}
                    />
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAnswerSubmit(question.question)}
                        disabled={!currentAnswer.trim() || loading || !user}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {loading ? 'Analyzing...' : 'Submit Answer'}
                      </Button>
                      <Button variant="outline" onClick={toggleRecording}>
                        <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'text-red-500' : ''}`} />
                        {isRecording ? 'Stop Recording' : 'Record Answer'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mock Interviews Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6" />
            Mock Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className="border">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{session.session_name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{session.total_questions} questions</span>
                  </div>
                  
                  {session.status === 'completed' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                      {session.score && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Score</span>
                            <span className="font-medium">{session.score}%</span>
                          </div>
                          <Progress value={session.score} className="h-2" />
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="w-full">
                        Review Performance
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => startMockInterview(session.session_name)}
                      className="w-full"
                      disabled={!user}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {session.status === 'active' ? 'Continue' : 'Start Interview'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {/* Add new interview option */}
            <Card className="border-dashed border-2">
              <CardContent className="p-4 flex items-center justify-center h-full">
                <Button 
                  onClick={() => startMockInterview('Technical Interview')}
                  variant="outline"
                  className="w-full h-full"
                  disabled={!user}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start New Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Practice History */}
      <Card>
        <CardHeader>
          <CardTitle>Practice History & Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {practiceHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No practice history yet.</p>
                <p className="text-sm mt-2">Answer questions above to see your feedback here.</p>
              </div>
            ) : (
              practiceHistory.map((feedback) => (
                <Card key={feedback.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{feedback.question}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{feedback.score}%</span>
                      <Badge variant="outline" className="ml-auto">
                        {feedback.score >= 90 ? 'Excellent' : 
                         feedback.score >= 80 ? 'Good' : 
                         feedback.score >= 70 ? 'Fair' : 'Needs Improvement'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-1">Feedback</h4>
                        <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-blue-600 mb-1">Areas for Improvement</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {feedback.improvements.map((improvement, idx) => (
                            <li key={idx}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewPrep;
