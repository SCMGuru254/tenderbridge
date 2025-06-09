import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, MailOpen, Reply } from "lucide-react";

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  isRead?: boolean;
}

interface MessageListProps {
  messages: Message[];
  onReply: (messageId: string) => void;
}

export const MessageList = ({ messages, onReply }: MessageListProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = messages.filter(msg => !msg.isRead).length;
    setUnreadCount(unread);
  }, [messages]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MailOpen className="h-5 w-5" />
          Messages
        </CardTitle>
        {unreadCount > 0 && (
          <Badge variant="secondary">
            {unreadCount} Unread
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-4">
            {messages.map((message) => (
              <div key={message.id} className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">
                    {message.sender === 'user' ? 'You' : 'Agent'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {message.content}
                </p>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onReply(message.id)}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                No messages to display.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
