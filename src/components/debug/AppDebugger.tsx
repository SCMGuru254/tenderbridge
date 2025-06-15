import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { useJobData } from "@/hooks/useJobData";

export const AppDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { user, loading: userLoading } = useUser();
  const { postedJobs, scrapedJobs } = useJobData();

  useEffect(() => {
    const info = {
      timestamp: new Date().toISOString(),
      user: {
        exists: !!user,
        loading: userLoading,
        id: user?.id || 'none'
      },
      jobs: {
        postedCount: postedJobs?.length || 0,
        scrapedCount: scrapedJobs?.length || 0,
        loading: userLoading // only basic info
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        location: window.location.href,
        userAgent: navigator.userAgent.substring(0, 50)
      },
      react: {
        version: React.version
      }
    };
    
    setDebugInfo(info);
    console.log('App Debug Info:', info);
  }, [user, userLoading, postedJobs, scrapedJobs]);

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
          <strong>Posted Jobs:</strong> {debugInfo.jobs?.postedCount} loaded
        </div>
        <div>
          <strong>Scraped Jobs:</strong> {debugInfo.jobs?.scrapedCount} loaded
        </div>
        <div>
          <strong>React:</strong> {debugInfo.react?.version}
        </div>
        <div>
          <strong>Location:</strong> {debugInfo.environment?.location}
        </div>
      </CardContent>
    </Card>
  );
};
