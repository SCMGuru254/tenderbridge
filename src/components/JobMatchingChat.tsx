import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bot, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEnhancedJobMatcher } from '@/hooks/useEnhancedJobMatcher';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  jobSuggestions?: JobSuggestion[];
}

interface JobSuggestion {
  title: string;
  company: string;
  location: string;
  match: number;
  factors: string[];
}

export default function JobMatchingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [matchProgress, setMatchProgress] = useState(0);
  const { findMatches, isProcessing } = useEnhancedJobMatcher();
  const { user } = useAuth();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // Start matching process with progress tracking
      const matches = await findMatches(
        inputMessage,
        user?.profile,
        (progress) => setMatchProgress(progress)
      );

      const suggestions: JobSuggestion[] = matches.map(match => ({
        title: match.job.title,
        company: match.job.company,
        location: match.job.location,
        match: Math.round(match.score * 100),
        factors: match.matchingFactors
      }));

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: suggestions.length > 0
          ? `I found ${suggestions.length} jobs that match your profile! Here are the best matches:`
          : "I couldn't find any exact matches. Try being more specific about the type of job you're looking for.",
        sender: 'bot',
        timestamp: new Date(),
        jobSuggestions: suggestions
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setMatchProgress(0);
    }
  }, [inputMessage, isProcessing, findMatches, user]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Job Matcher</CardTitle>
        <CardDescription>
          Tell me about your ideal job or ask about specific positions
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}

            <div className={`max-w-[80%] ${message.sender === 'user' ? 'ml-auto' : ''}`}>
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.jobSuggestions && (
                <div className="mt-2 space-y-2">
                  {message.jobSuggestions.map((job, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{job.title}</h4>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                          <p className="text-xs text-muted-foreground">{job.location}</p>
                          <div className="mt-1">
                            {job.factors.map((factor, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs mr-1 mb-1"
                              >
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge
                          variant={job.match > 80 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {job.match}% match
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Finding matches...</span>
            </div>
            <Progress value={matchProgress} className="h-1" />
          </div>
        )}
      </CardContent>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Describe your ideal job..."
            className="flex-1 px-3 py-2 text-sm border rounded-md"
            disabled={isProcessing}
          />
          <Button type="submit" disabled={isProcessing}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
};
