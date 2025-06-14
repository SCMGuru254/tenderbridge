
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  type: "user" | "bot";
  content: string;
};

const JobMatchingChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Real job search using jobs & scraped_jobs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { type: "user", content: userMessage },
    ]);
    setIsLoading(true);

    try {
      // Search "jobs" table for matching titles or skills
      const { data: posted, error: postedError } = await supabase
        .from("jobs")
        .select("*")
        .or(`title.ilike.%${userMessage}%,description.ilike.%${userMessage}%`)
        .limit(5);

      // Search "scraped_jobs" table for matching titles or skills
      const { data: scraped, error: scrapedError } = await supabase
        .from("scraped_jobs")
        .select("*")
        .or(`title.ilike.%${userMessage}%,description.ilike.%${userMessage}%`)
        .limit(5);

      if (postedError && scrapedError) {
        throw new Error("Failed to load jobs. Try again.");
      }

      const jobs = [
        ...(posted ?? []),
        ...(scraped ?? []),
      ].slice(0, 5);

      if (jobs.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content:
              "Sorry, no job matches found. Try searching with different keywords.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content:
              "Here are some jobs I found:\n" +
              jobs
                .map(
                  (job) =>
                    `• ${job.title} at ${job.company || "N/A"} (${job.location || "Kenya"})`
                )
                .join("\n"),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "Sorry, there was an error finding jobs. Please try again later.",
        },
      ]);
      console.error("JobMatchingChat error:", error);
    } finally {
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
                className={`p-3 rounded-md ${
                  message.type === "user"
                    ? "bg-blue-100 text-blue-800 ml-auto w-fit"
                    : "bg-gray-100 text-gray-800 mr-auto w-fit"
                } whitespace-pre-line`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-md bg-gray-100 text-gray-800 mr-auto w-fit flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Searching...
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your ideal job or skills..."
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
