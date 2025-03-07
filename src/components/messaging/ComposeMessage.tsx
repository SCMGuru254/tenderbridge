
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  recipient_id: z.string().min(1, { message: "Please select a recipient" }),
  subject: z.string().min(1, { message: "Subject is required" }).max(100),
  content: z.string().min(1, { message: "Message content is required" }).max(2000),
});

type ComposeFormValues = z.infer<typeof formSchema>;

interface ComposeMessageProps {
  currentUserId: string | undefined;
  onMessageSent?: () => void;
  preselectedRecipient?: { id: string; name: string } | null;
}

export const ComposeMessage = ({ 
  currentUserId, 
  onMessageSent,
  preselectedRecipient 
}: ComposeMessageProps) => {
  const [sending, setSending] = useState(false);

  // Fetch all users for recipient selection
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["message-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .neq("id", currentUserId) // Exclude current user
        .order("full_name");

      if (error) throw error;
      return data;
    },
    enabled: !!currentUserId,
  });

  const form = useForm<ComposeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient_id: preselectedRecipient?.id || "",
      subject: "",
      content: "",
    },
  });

  const onSubmit = async (values: ComposeFormValues) => {
    if (!currentUserId) {
      toast.error("You must be signed in to send messages");
      return;
    }

    try {
      setSending(true);

      const { error } = await supabase.from("messages").insert({
        sender_id: currentUserId,
        recipient_id: values.recipient_id,
        subject: values.subject,
        content: values.content,
      });

      if (error) throw error;

      toast.success("Message sent successfully");
      form.reset();
      if (onMessageSent) onMessageSent();
    } catch (error: any) {
      toast.error("Failed to send message: " + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose New Message</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <Select
                    disabled={sending || !!preselectedRecipient}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a recipient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingUsers ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2">Loading...</span>
                        </div>
                      ) : (
                        users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input disabled={sending} placeholder="Message subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={sending}
                      placeholder="Type your message here..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0">
              <Button type="submit" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
