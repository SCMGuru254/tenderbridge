
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Flag, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReportSystemProps {
  contentId: string;
  contentType: 'job' | 'review' | 'discussion' | 'profile';
  className?: string;
}

export const ReportSystem = ({ contentId, contentType, className }: ReportSystemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = {
    job: [
      "Spam or fake job posting",
      "Inappropriate content",
      "Discrimination",
      "Misleading information",
      "Scam or fraudulent activity",
      "Other"
    ],
    review: [
      "Fake review",
      "Inappropriate language",
      "Personal attack",
      "Spam content",
      "Offensive content",
      "Other"
    ],
    discussion: [
      "Spam content",
      "Harassment",
      "Inappropriate content",
      "Off-topic discussion",
      "Misinformation",
      "Other"
    ],
    profile: [
      "Fake profile",
      "Inappropriate content",
      "Spam or promotional content",
      "Impersonation",
      "Harassment",
      "Other"
    ]
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('handle-report', {
        body: {
          contentId,
          contentType,
          reason,
          details,
          reportedAt: new Date().toISOString()
        }
      });

      if (error) throw error;

      toast.success("Report submitted successfully. Our team will review it within 24 hours.");
      setIsOpen(false);
      setReason("");
      setDetails("");
    } catch (error) {
      console.error('Report submission error:', error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Report Content
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Reason for reporting
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons[contentType].map((reasonOption) => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional details (optional)
            </label>
            <Textarea
              placeholder="Provide any additional information about this report..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> All reports are reviewed by our moderation team within 24 hours. 
              Content found to violate our terms will be marked as spam and removed.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!reason || isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
