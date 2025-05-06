
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sanitizeInput } from "@/utils/inputValidation";

const reportSchema = z.object({
  headhunterName: z.string().min(2, {
    message: "Headhunter name must be at least 2 characters.",
  }),
  headhunterEmail: z.string().email({
    message: "Please enter a valid email address.",
  }).or(z.string().length(0)),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  description: z.string().min(20, {
    message: "Please provide more details (at least 20 characters).",
  }).max(1000, {
    message: "Description must not exceed 1000 characters."
  }),
  evidence: z.string().optional(),
  yourEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ReportHeadhunterForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      headhunterName: "",
      headhunterEmail: "",
      companyName: "",
      description: "",
      evidence: "",
      yourEmail: "",
    },
  });
  
  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        headhunterName: sanitizeInput(data.headhunterName),
        headhunterEmail: sanitizeInput(data.headhunterEmail),
        companyName: sanitizeInput(data.companyName),
        description: sanitizeInput(data.description),
        evidence: data.evidence ? sanitizeInput(data.evidence) : "",
        yourEmail: sanitizeInput(data.yourEmail),
      };
      
      console.log("Report submitted:", sanitizedData);
      
      // Here you would connect to your backend API to save the report
      // For now, we're just simulating the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Report received",
        description: "Thank you for your report. We'll investigate this case and take appropriate action.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-xl">
      <h3 className="font-bold text-lg mb-2">Report Fake Headhunter</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Help us protect our community by reporting suspicious headhunters or recruiters.
        Your report will be kept confidential and investigated by our team.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="headhunterName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headhunter/Recruiter Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of the suspicious recruiter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="headhunterEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headhunter Email (if available)</FormLabel>
                <FormControl>
                  <Input placeholder="Email of the suspicious recruiter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company They Claim to Represent</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description of the Issue</FormLabel>
                <FormDescription>
                  Please provide details about your interaction, any red flags you noticed,
                  and why you believe this may be a fake headhunter.
                </FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the suspicious behavior in detail..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="evidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evidence (Optional)</FormLabel>
                <FormDescription>
                  Provide links to messages, job posts, or any other evidence.
                </FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="Links or other evidence..." 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="yourEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email</FormLabel>
                <FormDescription>
                  So we can contact you for more information if needed.
                  Your email will be kept confidential.
                </FormDescription>
                <FormControl>
                  <Input type="email" placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? "Submitting Report..." : "Submit Report"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReportHeadhunterForm;
