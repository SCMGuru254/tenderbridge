
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HiringDecision } from "@/types/profiles";

interface HiringDecisionsTabProps {
  hiringDecisions: HiringDecision[];
}

export const HiringDecisionsTab = ({ hiringDecisions }: HiringDecisionsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hiring Decisions</CardTitle>
          <CardDescription>Track your hiring decisions and outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          {hiringDecisions.length > 0 ? (
            <div className="space-y-4">
              {hiringDecisions.map((decision) => (
                <div key={decision.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">Decision by {decision.employer.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(decision.decision_date).toLocaleDateString()}
                    </p>
                  </div>
                  {decision.notes && (
                    <p className="text-sm text-muted-foreground">{decision.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No hiring decisions recorded yet. Start tracking your hiring process to gain insights.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
