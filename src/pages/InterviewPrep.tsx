
import { useState } from 'react';
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

interface Question {
  id: string;
  type: 'behavioral' | 'technical' | 'situational';
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface MockInterview {
  id: string;
  type: string;
  duration: number;
  completed: boolean;
  score?: number;
}

interface Feedback {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  improvements: string[];
}

const InterviewPrep = () => {
  const [selectedQuestionType, setSelectedQuestionType] = useState<'behavioral' | 'technical' | 'situational'>('behavioral');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mockInterviews, setMockInterviews] = useState<MockInterview[]>([
    { id: '1', type: 'Technical Interview', duration: 45, completed: true, score: 85 },
    { id: '2', type: 'Behavioral Interview', duration: 30, completed: false },
    { id: '3', type: 'Leadership Interview', duration: 60, completed: true, score: 92 }
  ]);
  const [practiceHistory, setPracticeHistory] = useState<Feedback[]>([
    {
      question: "Tell me about a time you had to manage a supply chain crisis",
      answer: "During the COVID-19 pandemic, our main supplier shut down...",
      score: 88,
      feedback: "Great use of STAR method and quantifiable results",
      improvements: ["Add more specific metrics", "Mention stakeholder communication"]
    }
  ]);

  const questions: Question[] = [
    {
      id: '1',
      type: 'behavioral',
      question: "Tell me about a time you had to manage a supply chain disruption.",
      difficulty: 'medium',
      category: 'Crisis Management'
    },
    {
      id: '2',
      type: 'technical',
      question: "How would you optimize inventory levels to reduce carrying costs?",
      difficulty: 'hard',
      category: 'Inventory Management'
    },
    {
      id: '3',
      type: 'situational',
      question: "A key supplier is consistently late with deliveries. How do you handle this?",
      difficulty: 'medium',
      category: 'Supplier Relations'
    },
    {
      id: '4',
      type: 'behavioral',
      question: "Describe a time when you improved a process that resulted in cost savings.",
      difficulty: 'easy',
      category: 'Process Improvement'
    }
  ];

  const filteredQuestions = questions.filter(q => q.type === selectedQuestionType);

  const handleAnswerSubmit = async (question: string) => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    // Simulate AI analysis
    const mockFeedback: Feedback = {
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

    setPracticeHistory(prev => [mockFeedback, ...prev]);
    setCurrentAnswer('');
    toast.success('Answer analyzed! Check your feedback below.');
  };

  const startMockInterview = (interviewType: string) => {
    toast.success(`Starting ${interviewType}...`);
    // Here you would implement the mock interview logic
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
            {filteredQuestions.map((question) => (
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
                      disabled={!currentAnswer.trim()}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Answer
                    </Button>
                    <Button variant="outline" onClick={toggleRecording}>
                      <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'text-red-500' : ''}`} />
                      {isRecording ? 'Stop Recording' : 'Record Answer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            {mockInterviews.map((interview) => (
              <Card key={interview.id} className="border">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{interview.type}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{interview.duration} minutes</span>
                  </div>
                  
                  {interview.completed ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                      {interview.score && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Score</span>
                            <span className="font-medium">{interview.score}%</span>
                          </div>
                          <Progress value={interview.score} className="h-2" />
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="w-full">
                        Review Performance
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => startMockInterview(interview.type)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Interview
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
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
            {practiceHistory.map((feedback, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewPrep;
