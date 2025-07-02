
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Sparkles,
  Briefcase,
  TrendingUp,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  type: 'career' | 'supply-chain' | 'interview' | 'general';
  created_at: Date;
}

export const AIChatAssistant = () => {
  const [activeTab, setActiveTab] = useState('career');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<Record<string, ChatSession>>({
    career: {
      id: 'career-1',
      title: 'Career Advisor',
      messages: [{
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI Career Advisor. I can help you with career planning, job search strategies, resume optimization, and professional development. What would you like to discuss?',
        timestamp: new Date()
      }],
      type: 'career',
      created_at: new Date()
    },
    'supply-chain': {
      id: 'supply-1',
      title: 'Supply Chain Expert',
      messages: [{
        id: '1',
        role: 'assistant',
        content: 'Hi! I\'m your Supply Chain AI Assistant. I can help with logistics optimization, inventory management, procurement strategies, and industry best practices. How can I assist you today?',
        timestamp: new Date()
      }],
      type: 'supply-chain',
      created_at: new Date()
    },
    interview: {
      id: 'interview-1',
      title: 'Interview Coach',
      messages: [{
        id: '1',
        role: 'assistant',
        content: 'Welcome! I\'m your AI Interview Coach. I can help you prepare for interviews, practice common questions, and provide feedback on your responses. What interview support do you need?',
        timestamp: new Date()
      }],
      type: 'interview',
      created_at: new Date()
    }
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [sessions, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSystemPrompt = (type: string) => {
    switch (type) {
      case 'career':
        return `You are an expert career advisor specializing in supply chain and logistics careers in Kenya and East Africa. 
        You provide practical advice on job searching, career development, skill building, networking, and professional growth. 
        Keep responses helpful, actionable, and focused on the East African job market context.`;
      
      case 'supply-chain':
        return `You are a supply chain and logistics expert with deep knowledge of African markets, particularly Kenya. 
        You help with optimization strategies, best practices, technology solutions, and industry insights. 
        Focus on practical, implementable advice suitable for the East African business environment.`;
      
      case 'interview':
        return `You are an experienced interview coach specializing in supply chain, logistics, and related fields. 
        You help candidates prepare for interviews by providing mock questions, feedback, and strategies. 
        Tailor advice to the Kenyan job market and interview practices.`;
      
      default:
        return `You are a helpful AI assistant specializing in supply chain, logistics, and career development.`;
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    // Add user message to current session
    setSessions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        messages: [...prev[activeTab].messages, userMessage]
      }
    }));

    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Call our edge function for AI response
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: messageToSend,
          context: getSystemPrompt(activeTab),
          conversation_history: sessions[activeTab].messages.slice(-5) // Last 5 messages for context
        }
      });

      if (error) {
        console.error('AI Chat Error:', error);
        throw error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };

      setSessions(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          messages: [...prev[activeTab].messages, aiMessage]
        }
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response when AI service is unavailable
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getFallbackResponse(activeTab, messageToSend),
        timestamp: new Date()
      };

      setSessions(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          messages: [...prev[activeTab].messages, fallbackMessage]
        }
      }));
      
      toast.error('AI service temporarily unavailable. Using fallback response.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (type: string, userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (type === 'career') {
      if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
        return "For resume optimization, focus on: 1) Quantifiable achievements, 2) Relevant keywords from job descriptions, 3) Clear formatting, 4) Tailoring for each application. In Kenya's job market, highlight your adaptability and any international experience.";
      }
      if (lowerMessage.includes('interview')) {
        return "For interview preparation: 1) Research the company thoroughly, 2) Practice STAR method responses, 3) Prepare questions about company culture, 4) Dress professionally. Kenyan employers value reliability and cultural fit.";
      }
      if (lowerMessage.includes('salary')) {
        return "Salary negotiation tips: 1) Research market rates using platforms like Glassdoor, 2) Consider total compensation package, 3) Be prepared to justify your value, 4) In Kenya, be respectful but confident in negotiations.";
      }
      return "I can help you with career development, job search strategies, resume optimization, interview preparation, and professional growth. What specific career challenge are you facing?";
    }
    
    if (type === 'supply-chain') {
      if (lowerMessage.includes('inventory')) {
        return "Inventory management best practices: 1) Implement ABC analysis, 2) Use demand forecasting, 3) Maintain safety stock levels, 4) Regular audits. In Kenya, consider seasonal variations and supply disruptions.";
      }
      if (lowerMessage.includes('logistics')) {
        return "Logistics optimization tips: 1) Route optimization software, 2) Consolidate shipments, 3) Build strong carrier relationships, 4) Track KPIs. Consider Kenya's infrastructure challenges and peak traffic times.";
      }
      if (lowerMessage.includes('procurement')) {
        return "Procurement strategies: 1) Supplier diversification, 2) Contract negotiations, 3) Quality assessments, 4) Cost analysis. In Kenya, build relationships with local suppliers for better terms.";
      }
      return "I can assist with supply chain optimization, logistics management, procurement strategies, inventory control, and industry best practices. What supply chain challenge would you like to discuss?";
    }
    
    if (type === 'interview') {
      if (lowerMessage.includes('common questions') || lowerMessage.includes('practice')) {
        return "Common supply chain interview questions: 1) 'Describe your experience with inventory management', 2) 'How do you handle supply disruptions?', 3) 'What KPIs do you track?', 4) 'Tell me about a process improvement you implemented'. Would you like to practice any of these?";
      }
      return "I can help you practice interview questions, improve your responses, and build confidence. What specific interview preparation would you like to work on?";
    }
    
    return "I'm here to help! You can ask me about career advice, supply chain topics, or interview preparation. What would you like to discuss?";
  };

  const clearChat = () => {
    setSessions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        messages: [prev[activeTab].messages[0]] // Keep only the initial message
      }
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'career': return <Briefcase className="h-4 w-4" />;
      case 'supply-chain': return <TrendingUp className="h-4 w-4" />;
      case 'interview': return <BookOpen className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Chat Assistants
        </h1>
        <p className="text-muted-foreground">
          Get instant expert advice powered by advanced AI technology
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="career" className="flex items-center gap-2">
                {getTabIcon('career')}
                Career Advisor
              </TabsTrigger>
              <TabsTrigger value="supply-chain" className="flex items-center gap-2">
                {getTabIcon('supply-chain')}
                Supply Chain Expert
              </TabsTrigger>
              <TabsTrigger value="interview" className="flex items-center gap-2">
                {getTabIcon('interview')}
                Interview Coach
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              {sessions[activeTab]?.title}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearChat}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {sessions[activeTab]?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask your ${sessions[activeTab]?.title.toLowerCase()}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!currentMessage.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Usage Info */}
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
            <span>•</span>
            <span>Free to use</span>
            <span>•</span>
            <span>Available 24/7</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
