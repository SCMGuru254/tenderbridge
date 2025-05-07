
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { validateInput, sanitizeInput } from "@/utils/inputValidation";
import { supabase } from "@/integrations/supabase/client";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput(email, "email")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert email into our newsletter_subscribers table
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: sanitizeInput(email) }]);

      if (error) {
        // Check if this is a unique constraint violation (email already exists)
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
        } else {
          console.error("Supabase error:", error);
          throw error;
        }
      } else {
        toast({
          title: "Subscribed!",
          description: "You've been successfully subscribed to our newsletter.",
        });
      }
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <h3 className="font-bold text-lg mb-4">Subscribe to our Newsletter</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get the latest supply chain news and job opportunities directly in your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(sanitizeInput(e.target.value))}
          required
          className="flex-grow"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterForm;
