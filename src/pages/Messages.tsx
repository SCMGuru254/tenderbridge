
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/messaging/MessageList";
import { ComposeMessage } from "@/components/messaging/ComposeMessage";
import { useNavigate } from "react-router-dom";
import { Inbox, Send, PenSquare } from "lucide-react";

const MessagesPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inbox");
  const [composing, setComposing] = useState(false);

  // Mock messages data - in a real app, this would come from your backend
  const mockMessages = [
    {
      id: "1",
      sender: "agent" as const,
      content: "Welcome to our platform! How can we help you today?",
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: "2", 
      sender: "user" as const,
      content: "I'm looking for job opportunities in supply chain management.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true
    }
  ];

  const handleReply = (messageId: string) => {
    console.log('Reply to message:', messageId);
    setComposing(true);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="mb-8">Please sign in to view and send messages.</p>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button 
          onClick={() => setComposing(!composing)} 
          className="mt-4 sm:mt-0"
        >
          {composing ? (
            <>Cancel</>
          ) : (
            <><PenSquare className="mr-2 h-4 w-4" /> New Message</>
          )}
        </Button>
      </div>
      
      {composing ? (
        <div className="mb-8">
          <ComposeMessage 
            currentUserId={user.id} 
            onMessageSent={() => {
              setComposing(false);
              setActiveTab("sent");
            }}
          />
        </div>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="inbox">
            <Inbox className="h-4 w-4 mr-2" /> Inbox
          </TabsTrigger>
          <TabsTrigger value="sent">
            <Send className="h-4 w-4 mr-2" /> Sent
          </TabsTrigger>
          <TabsTrigger value="all">
            <Send className="h-4 w-4 mr-2" /> All Messages
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
          <MessageList 
            messages={mockMessages} 
            onReply={handleReply}
            currentUserId={user.id}
          />
        </TabsContent>
        <TabsContent value="sent">
          <MessageList 
            messages={mockMessages.filter(msg => msg.sender === 'user')} 
            onReply={handleReply}
            currentUserId={user.id}
          />
        </TabsContent>
        <TabsContent value="all">
          <MessageList 
            messages={mockMessages} 
            onReply={handleReply}
            currentUserId={user.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesPage;
