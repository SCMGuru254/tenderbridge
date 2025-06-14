
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface JobAlert {
  id: string;
  title: string;
  location: string;
  frequency: string;
  isActive: boolean;
}

export const JobAlertsList = () => {
  const alerts: JobAlert[] = [
    {
      id: '1',
      title: 'Supply Chain Manager',
      location: 'Nairobi',
      frequency: 'Daily',
      isActive: true
    },
    {
      id: '2',
      title: 'Logistics Coordinator',
      location: 'Mombasa',
      frequency: 'Weekly',
      isActive: true
    }
  ];

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No job alerts created yet. Create your first alert to get started!
        </p>
      ) : (
        alerts.map((alert) => (
          <Card key={alert.id} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {alert.location} • {alert.frequency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.isActive ? "default" : "secondary"}>
                    {alert.isActive ? "Active" : "Paused"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
