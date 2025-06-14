import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const JobMatchingChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Mock AI response - replace with actual API call
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: 'I can help you find supply chain jobs in Kenya. What specific role or skills are you looking for?'
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Job Matching Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] mb-4">
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-md ${message.type === 'user' ? 'bg-blue-100 text-blue-800 ml-auto w-fit' : 'bg-gray-100 text-gray-800 mr-auto w-fit'}`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-md bg-gray-100 text-gray-800 mr-auto w-fit">
                Loading...
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow mr-2"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobMatchingChat;
