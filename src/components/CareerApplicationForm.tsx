
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { submitCareerApplication } from "@/services/careersService";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  applicant_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  applicant_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  proposal_text: z.string().min(100, {
    message: "Your vision proposal must be at least 100 characters.",
  }),
});

export function CareerApplicationForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicant_name: "",
      applicant_email: "",
      proposal_text: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      await submitCareerApplication(
        values.applicant_name,
        values.applicant_email,
        values.proposal_text,
        user?.id
      );
      
      toast.success("Your vision has been submitted successfully!");
      navigate("/careers?tab=submissions");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit your vision. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="applicant_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="applicant_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="proposal_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Vision for SupplyChain_KE</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your vision for enhancing the platform and driving traffic, engagement, and success."
                  className="min-h-40"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="bg-purple-700 hover:bg-purple-800 w-full">
          {isSubmitting ? "Submitting..." : "Submit Your Vision"}
        </Button>
      </form>
    </Form>
  );
}
