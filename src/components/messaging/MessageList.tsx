
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Message } from "@/types/messaging";

interface MessageListProps {
  filter: "sent" | "received" | "all";
  currentUserId: string | undefined;
}

export const MessageList = ({ filter, currentUserId }: MessageListProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", filter, currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      
      let query = supabase.from("messages").select(`
        id,
        sender_id,
        recipient_id,
        subject,
        content,
        created_at,
        updated_at,
        read
      `);
      
      if (filter === "sent") {
        query = query.eq("sender_id", currentUserId);
      } else if (filter === "received") {
        query = query.eq("recipient_id", currentUserId);
      } else {
        // For "all", get both sent and received
        query = query.or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Get sender and recipient profile information
      const userIds = new Set<string>();
      data.forEach(msg => {
        userIds.add(msg.sender_id);
        userIds.add(msg.recipient_id);
      });
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", Array.from(userIds));
      
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      
      // Attach sender and recipient information to messages
      const messagesWithProfiles = data.map(msg => ({
        ...msg,
        sender: profileMap.get(msg.sender_id) || { 
          id: msg.sender_id, 
          full_name: 'Unknown User', 
          avatar_url: null 
        },
        recipient: profileMap.get(msg.recipient_id) || { 
          id: msg.recipient_id, 
          full_name: 'Unknown User', 
          avatar_url: null 
        }
      }));
      
      return messagesWithProfiles as Message[];
    },
    enabled: !!currentUserId,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading messages: {error.message}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        {filter === "sent" ? "You haven't sent any messages yet." : 
         filter === "received" ? "You haven't received any messages yet." : 
         "No messages found."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className={`border-l-4 ${message.sender_id === currentUserId ? "border-l-blue-500" : "border-l-green-500"}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                {message.sender_id === currentUserId 
                  ? `To: ${message.recipient?.full_name || 'Unknown User'}`
                  : `From: ${message.sender?.full_name || 'Unknown User'}`}
              </CardTitle>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-1 font-medium">{message.subject}</p>
            <p className="text-sm text-gray-700">{message.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
