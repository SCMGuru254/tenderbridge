
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, MessageCircle, BookOpen, Target } from 'lucide-react';

const InterviewPrep = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock AI response for demo
      setTimeout(() => {
        setResponse(`Here's a structured approach to answer "${question}":

**Situation**: Start by describing the context and background of the situation you're discussing.

**Task**: Explain what you needed to accomplish or what challenge you faced.

**Action**: Detail the specific steps you took to address the situation.

**Result**: Share the outcome and what you learned from the experience.

**Key Tips for Supply Chain Interviews**:
- Emphasize cost optimization and efficiency improvements
- Mention specific technologies or methodologies you've used
- Quantify your achievements with metrics when possible
- Show understanding of end-to-end supply chain processes`);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setLoading(false);
    }
  };

  const commonQuestions = [
    "Tell me about a time you optimized a supply chain process",
    "How do you handle supply chain disruptions?",
    "Describe your experience with inventory management",
    "What's your approach to vendor relationship management?",
    "How do you measure supply chain performance?"
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Interview Preparation</h1>
        <p className="text-muted-foreground">
          Get AI-powered assistance to prepare for your supply chain interviews
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Practice Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get personalized responses to common interview questions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              STAR Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learn to structure your answers using the proven STAR framework
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Industry Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Specialized guidance for supply chain and logistics roles
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ask AI for Interview Help</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question">Interview Question</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter an interview question you'd like help with..."
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Getting AI Response...' : 'Get AI Help'}
              </Button>
            </form>

            {response && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  AI Response
                </h4>
                <div className="whitespace-pre-wrap text-sm">{response}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Supply Chain Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commonQuestions.map((q, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setQuestion(q)}
                >
                  <p className="text-sm">{q}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Key Areas to Focus On</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Cost Optimization</Badge>
                <Badge variant="secondary">Risk Management</Badge>
                <Badge variant="secondary">Technology Integration</Badge>
                <Badge variant="secondary">Process Improvement</Badge>
                <Badge variant="secondary">Vendor Management</Badge>
                <Badge variant="secondary">Data Analysis</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewPrep;
