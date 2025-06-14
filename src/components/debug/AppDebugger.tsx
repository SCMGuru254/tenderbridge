
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { useJobData } from "@/hooks/useJobData";

export const AppDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { user, loading: userLoading } = useUser();
  const { allJobs, isLoading: jobsLoading, errors } = useJobData();

  useEffect(() => {
    const info = {
      timestamp: new Date().toISOString(),
      user: {
        exists: !!user,
        loading: userLoading,
        id: user?.id || 'none'
      },
      jobs: {
        count: allJobs?.length || 0,
        loading: jobsLoading,
        errors: errors
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        location: window.location.href,
        userAgent: navigator.userAgent.substring(0, 50)
      }
    };
    
    setDebugInfo(info);
    console.log('App Debug Info:', info);
  }, [user, userLoading, allJobs, jobsLoading, errors]);

  return (
    <Card className="m-4 border-orange-200">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          Debug Information
          <Badge variant="outline">Dev Mode</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>User Status:</strong> {debugInfo.user?.exists ? 'Authenticated' : 'Anonymous'} 
          {debugInfo.user?.loading && ' (Loading...)'}
        </div>
        <div>
          <strong>Jobs:</strong> {debugInfo.jobs?.count} loaded 
          {debugInfo.jobs?.loading && ' (Loading...)'}
        </div>
        {debugInfo.jobs?.errors && (
          <div className="text-red-600">
            <strong>Errors:</strong> {JSON.stringify(debugInfo.jobs.errors)}
          </div>
        )}
        <div>
          <strong>Location:</strong> {debugInfo.environment?.location}
        </div>
      </CardContent>
    </Card>
  );
};
