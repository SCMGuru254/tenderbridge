
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  jobs?: any[];
}

export const JobMatchingChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your job matching and interview preparation assistant. I can help you find supply chain jobs in Kenya and provide guidance for interview questions. What would you like help with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("job-match-chat", {
        body: { query: input }
      });
      
      if (error) throw error;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        jobs: data.matchedJobs
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching job matches:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      });
      
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I had trouble processing your request. Please try again with a different question.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestions = () => {
    const suggestions = [
      "Find logistics jobs in Nairobi",
      "How to answer 'Tell me about yourself'",
      "What supply chain software should I know?",
      "How to handle supply chain disruptions in an interview",
      "Show procurement positions"
    ];
    
    return (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setInput(suggestion);
                setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Job & Interview Assistant</span>
          <Badge variant="outline" className="ml-2">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[90%] p-3 rounded-lg ${
                    message.role === 'assistant' 
                      ? 'bg-muted' 
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  {message.jobs && message.jobs.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-sm font-medium mb-2">Matched Jobs:</p>
                      <div className="space-y-2">
                        {message.jobs.slice(0, 3).map((job, index) => (
                          <div key={job.id} className="text-sm bg-background p-2 rounded">
                            <p className="font-medium">{job.title}</p>
                            <p className="text-xs">{job.company} • {job.location}</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {job.skills && job.skills.slice(0, 3).map((skill: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                              ))}
                              {job.skills && job.skills.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{job.skills.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {message.jobs.length > 3 && (
                          <p className="text-xs italic">{message.jobs.length - 3} more job matches...</p>
                        )}
                      </div>
                    </div>
                  )}
                  <span className="block mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        
        {messages.length === 1 && !isLoading && renderSuggestions()}
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask about jobs or interview questions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
