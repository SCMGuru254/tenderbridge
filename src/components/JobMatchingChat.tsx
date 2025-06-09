import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  job_type: string;
  category: string;
  job_url: string;
}

export const JobMatchingChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Job[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial bot message
    addMessage("Hello! I'm here to help you find relevant supply chain and logistics jobs. Tell me about your skills and preferences.", 'bot');
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage(userMessage, 'user');
    setInput("");
    setIsLoading(true);

    try {
      // Simulate job matching (replace with actual API call)
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .ilike('description', `%${userMessage}%`)
        .limit(5);

      if (error) {
        console.error("Error fetching jobs:", error);
        addMessage("Sorry, I encountered an error while searching for jobs.", 'bot');
        return;
      }

      if (data && data.length > 0) {
        const jobMatches: Job[] = data.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company || "N/A",
          location: job.location || "N/A",
          description: job.description || "N/A",
          job_type: job.job_type || "N/A",
          category: job.category || "N/A",
          job_url: job.job_url || "#"
        }));
        setMatches(jobMatches);
        addMessage(`I found ${jobMatches.length} supply chain and logistics jobs that might be a good fit for you!`, 'bot');
      } else {
        addMessage("I couldn't find any jobs matching your criteria. Please try again with different keywords.", 'bot');
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      addMessage("An unexpected error occurred. Please try again later.", 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobInterest = async (jobTitle: string) => {
    // Handle job interest logic here
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Supply Chain Job Matching Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Enter your supply chain skills and preferences..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-grow mr-2"
            onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
    
    {matches.length > 0 && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recommended Supply Chain Jobs</h3>
        <div className="grid gap-4">
          {matches.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{job.job_type}</span>
                </div>
                <Badge variant="secondary">{job.category}</Badge>
                <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Job
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )}
  );
};
