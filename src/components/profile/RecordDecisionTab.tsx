
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RecordDecisionTabProps {
  profile: any;
  onRecordDecision: (decisionDate: string, notes: string) => void;
}

export const RecordDecisionTab = ({ profile, onRecordDecision }: RecordDecisionTabProps) => {
  const [decisionDate, setDecisionDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decisionDate) {
      onRecordDecision(decisionDate, notes);
      setDecisionDate('');
      setNotes('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Record Decision</CardTitle>
          <CardDescription>Record hiring decisions for {profile?.full_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="decision-date">Decision Date</Label>
              <Input
                id="decision-date"
                type="date"
                value={decisionDate}
                onChange={(e) => setDecisionDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about your hiring decision..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button type="submit">Record Decision</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
