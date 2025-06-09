
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CronJobSetup = () => {
  const [status] = useState<'active' | 'inactive' | 'error'>('active');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Automated Content Sync
          <Badge variant={status === 'active' ? 'default' : 'destructive'}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Automatically fetches and updates supply chain news content every 6 hours.
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Last sync:</span>
            <span className="text-muted-foreground">2 hours ago</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Next sync:</span>
            <span className="text-muted-foreground">in 4 hours</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Items fetched:</span>
            <span className="text-muted-foreground">23 new articles</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CronJobSetup;
