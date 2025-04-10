
import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Profile } from "@/types/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RecordDecisionTabProps {
  profile: Profile | null;
  onRecordDecision: (decisionDate: string, notes: string) => Promise<void>;
}

const RecordDecisionTab = ({ profile, onRecordDecision }: RecordDecisionTabProps) => {
  const [decisionDate, setDecisionDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  
  const handleSubmit = async () => {
    await onRecordDecision(decisionDate, notes);
    setNotes("");
  };
  
  if (!profile) return null;
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="decision-date">Decision Date</Label>
        <Input
          id="decision-date"
          type="date"
          value={decisionDate}
          onChange={(e) => setDecisionDate(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any comments or notes about your decision..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1"
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        <CheckCircle className="h-4 w-4 mr-2" /> Record Decision
      </Button>
    </div>
  );
};

export default RecordDecisionTab;
