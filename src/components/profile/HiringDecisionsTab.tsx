
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const HiringDecisionsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hiring Decisions</CardTitle>
          <CardDescription>Track your hiring decisions and outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No hiring decisions recorded yet. Start tracking your hiring process to gain insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
