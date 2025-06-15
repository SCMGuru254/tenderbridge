
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  HelpCircle, 
  Star, 
  BookOpen,
  Target,
  Award,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const InterviewPrep = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestions = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: { 
          action: 'generate_questions',
          jobTitle,
          experienceLevel: experienceLevel || 'mid-level'
        }
      });

      if (error) throw error;

      const questions = [
        `Tell me about your experience in ${jobTitle} roles.`,
        `How do you handle challenges in ${jobTitle.includes('supply') ? 'supply chain' : 'your field'}?`,
        `Describe a time when you improved efficiency in your previous role.`,
        `What strategies do you use for problem-solving in ${jobTitle.includes('supply') ? 'logistics operations' : 'your work'}?`,
        `How do you stay updated with industry trends and best practices?`
      ];

      setGeneratedQuestions(questions);
      setCurrentQuestion(questions[0]);
      toast.success('Interview questions generated!');
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Fallback questions for supply chain roles
      const fallbackQuestions = [
        `Tell me about your experience in ${jobTitle} roles.`,
        'How do you handle supply chain disruptions?',
        'Describe a time when you improved efficiency in your operations.',
        'What strategies do you use for vendor relationship management?',
        'How do you stay updated with supply chain technology trends?'
      ];
      
      setGeneratedQuestions(fallbackQuestions);
      setCurrentQuestion(fallbackQuestions[0]);
      toast.success('Interview questions generated!');
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeAnswer = async () => {
    if (!currentQuestion.trim() || !userAnswer.trim()) {
      toast.error('Please provide both question and answer');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: { 
          question: currentQuestion,
          answer: userAnswer
        }
      });

      if (error) throw error;

      setFeedback(data.answer || 'Good answer! Consider adding more specific examples to strengthen your response.');
      toast.success('Feedback generated!');
    } catch (error) {
      console.error('Error analyzing answer:', error);
      setFeedback('Thank you for your answer. Remember to use the STAR method (Situation, Task, Action, Result) and include specific examples from your experience.');
      toast.success('Feedback provided!');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const interviewTips = [
    {
      category: 'STAR Method',
      tips: [
        'Situation: Set the context for your story',
        'Task: Describe your responsibility',
        'Action: Explain the steps you took',
        'Result: Share the outcome and impact'
      ]
    },
    {
      category: 'Supply Chain Specific',
      tips: [
        'Quantify your achievements with metrics',
        'Discuss cost savings and efficiency improvements',
        'Mention relevant software and tools (SAP, Excel, etc.)',
        'Highlight cross-functional collaboration'
      ]
    },
    {
      category: 'General Best Practices',
      tips: [
        'Research the company thoroughly',
        'Prepare thoughtful questions to ask',
        'Practice your body language and tone',
        'Follow up with a thank-you email'
      ]
    }
  ];

  const commonQuestions = [
    {
      question: "Tell me about yourself",
      category: "General",
      difficulty: "Easy"
    },
    {
      question: "How do you handle supply chain disruptions?",
      category: "Supply Chain",
      difficulty: "Medium"
    },
    {
      question: "Describe a time you reduced costs while maintaining quality",
      category: "Supply Chain",
      difficulty: "Medium"
    },
    {
      question: "How do you prioritize multiple urgent projects?",
      category: "Management",
      difficulty: "Medium"
    },
    {
      question: "What's your experience with ERP systems?",
      category: "Technical",
      difficulty: "Easy"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Interview Preparation Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Practice your interview skills with AI-powered feedback and personalized questions.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="practice">AI Practice</TabsTrigger>
          <TabsTrigger value="questions">Question Bank</TabsTrigger>
          <TabsTrigger value="tips">Interview Tips</TabsTrigger>
          <TabsTrigger value="feedback">Mock Interview</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Interview Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title</label>
                  <Input
                    placeholder="e.g., Supply Chain Manager"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <Input
                    placeholder="e.g., Senior, Mid-level, Entry"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={generateQuestions} 
                disabled={isGenerating || !jobTitle.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Generate Interview Questions
                  </>
                )}
              </Button>

              {generatedQuestions.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Question</label>
                    <div className="space-y-2">
                      {generatedQuestions.map((q, index) => (
                        <Button
                          key={index}
                          variant={currentQuestion === q ? "default" : "outline"}
                          className="w-full text-left justify-start h-auto py-3 px-4"
                          onClick={() => setCurrentQuestion(q)}
                        >
                          <span className="whitespace-normal">{q}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Answer</label>
                    <Textarea
                      placeholder="Type your answer here... Remember to use the STAR method!"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <Button 
                    onClick={analyzeAnswer} 
                    disabled={isAnalyzing || !userAnswer.trim()}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Answer...
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 h-4 w-4" />
                        Get AI Feedback
                      </>
                    )}
                  </Button>

                  {feedback && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-blue-800">AI Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{feedback}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Interview Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonQuestions.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{item.question}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant={
                          item.difficulty === 'Easy' ? 'secondary' :
                          item.difficulty === 'Medium' ? 'default' : 'destructive'
                        }>
                          {item.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentQuestion(item.question)}
                    >
                      Practice This Question
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          {interviewTips.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                Mock Interview Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Mock interview feature coming soon! For now, use the AI Practice tab to get feedback on individual questions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewPrep;
