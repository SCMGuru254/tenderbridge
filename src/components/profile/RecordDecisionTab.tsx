
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const RecordDecisionTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Record Decision</CardTitle>
          <CardDescription>Record hiring decisions for candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Use this section to record your hiring decisions and track outcomes.
            </p>
            <Button>Record New Decision</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
