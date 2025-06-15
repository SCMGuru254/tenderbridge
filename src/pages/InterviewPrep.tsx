
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  BookOpen, 
  Star,
  Brain,
  Clock,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const InterviewPrep = () => {
  const [questions, setQuestions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Interview Assistant. I can help you prepare for supply chain interviews, practice common questions, and provide personalized feedback. What would you like to work on today?'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [questionsResult, reviewsResult] = await Promise.all([
        supabase
          .from('interview_questions')
          .select('*')
          .order('upvotes', { ascending: false })
          .limit(10),
        supabase
          .from('interview_reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (questionsResult.error) throw questionsResult.error;
      if (reviewsResult.error) throw reviewsResult.error;

      setQuestions(questionsResult.data || []);
      setReviews(reviewsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! For supply chain interviews, focus on demonstrating your analytical thinking and problem-solving skills. Can you tell me about a specific supply chain challenge you'd like to practice discussing?",
        "That's an excellent area to focus on. In supply chain management, interviewers often ask about process optimization. Here's a framework: 1) Identify the current state, 2) Analyze bottlenecks, 3) Propose solutions, 4) Measure impact. Would you like to practice with a specific scenario?",
        "Perfect! Let's work on that together. When discussing inventory management in interviews, always mention: demand forecasting, safety stock calculations, ABC analysis, and supplier relationships. Would you like me to create a mock question for you?",
        "Excellent choice! Supply chain leadership questions often focus on: team management during disruptions, cross-functional collaboration, vendor negotiations, and strategic planning. Let's practice a behavioral question: 'Tell me about a time you led a team through a supply chain crisis.'"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Interview Preparation Hub</h1>
        <p className="text-muted-foreground">
          Master your supply chain interviews with AI-powered practice, real questions, and expert insights
        </p>
      </div>

      <Tabs defaultValue="ai-assistant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="questions">Practice Questions</TabsTrigger>
          <TabsTrigger value="reviews">Interview Reviews</TabsTrigger>
          <TabsTrigger value="tips">Tips & Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-assistant">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                AI Interview Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 h-96 overflow-y-auto space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about interview preparation, practice questions, or get feedback..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!userInput.trim() || isTyping}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Practice Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question: any) => (
                  <div key={question.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{question.question}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{question.company_name}</span>
                          <span>•</span>
                          <span>{question.position}</span>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>{question.upvotes || 0} upvotes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Interview Experience Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{review.company_name}</h3>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{review.position}</span>
                        </div>
                        {review.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            {getRatingStars(Math.round(review.rating))}
                            <span className="text-sm text-muted-foreground ml-2">
                              {review.rating}/5
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{review.review_text}</p>
                      </div>
                      <Badge className={getDifficultyColor(review.difficulty)}>
                        {review.difficulty}
                      </Badge>
                    </div>
                    
                    {review.interview_process && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Interview Process:</h4>
                        <p className="text-sm text-muted-foreground">{review.interview_process}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      {review.interview_date && (
                        <>
                          <span>•</span>
                          <span>Interview: {new Date(review.interview_date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Interview Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Technical Knowledge</h4>
                    <p className="text-sm text-blue-800">
                      Master key concepts: demand planning, inventory optimization, supplier management, and logistics.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Problem-Solving Framework</h4>
                    <p className="text-sm text-green-800">
                      Use structured approaches: SCOR model, root cause analysis, and data-driven decision making.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Leadership Examples</h4>
                    <p className="text-sm text-purple-800">
                      Prepare STAR stories showing crisis management, cross-functional collaboration, and process improvement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Question Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium">Operational Excellence</h4>
                    <p className="text-sm text-muted-foreground">
                      Process optimization, KPI management, cost reduction initiatives
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium">Strategic Planning</h4>
                    <p className="text-sm text-muted-foreground">
                      Network design, supplier strategy, digital transformation
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-medium">Crisis Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Disruption response, business continuity, risk mitigation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewPrep;
