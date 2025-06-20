
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobData } from "@/hooks/useJobData";
import { JobsMainContent } from "@/components/jobs/JobsMainContent";
import { SalaryAnalyzer } from "@/components/SalaryAnalyzer";
import { Mentorship } from "@/components/Mentorship";
import JobMatchingChat from "@/components/JobMatchingChat";
import { JobsBizDevelopment } from "@/components/JobsBizDevelopment";
import { ScrollArea } from "@/components/ui/scroll-area";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

// Custom fallback component for database connection errors
const DatabaseErrorFallback = () => {
  const handleRetry = () => {
    window.location.reload();
    toast({
      title: "Retrying connection",
      description: "Attempting to reconnect to the database..."
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 mt-8 animate-fade-in">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Service Temporarily Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>We're having trouble connecting to our job database at the moment.</p>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">This could be due to:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Temporary database maintenance</li>
                <li>Network connectivity issues</li>
                <li>High server load</li>
              </ul>
            </div>
            
            <p>Please try again in a few moments. We apologize for the inconvenience.</p>
            
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleRetry} 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Jobs = () => {
  const [mainTab, setMainTab] = useState("jobs");
  const { refetchPostedJobs, refetchAggregatedJobs } = useJobData();

  const handleRefreshComplete = () => {
    // Refresh both posted and aggregated jobs to ensure we have the latest data
    refetchPostedJobs();
    refetchAggregatedJobs();
  };

  return (
    <ErrorBoundary fallback={<DatabaseErrorFallback />}>
      <div className="container mx-auto px-4 py-12 mt-8 animate-fade-in">
        {/* Main tabs for the entire page */}
        <Tabs defaultValue="jobs" className="mb-8" value={mainTab} onValueChange={setMainTab}>
          <ScrollArea className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="jobs">Job Listings</TabsTrigger>
              <TabsTrigger value="chat">Job Matching</TabsTrigger>
              <TabsTrigger value="salary">Salary Analyzer</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="careers">Join Our Team</TabsTrigger>
            </TabsList>
          </ScrollArea>
          
          {/* Job Listings Content */}
          <TabsContent value="jobs" className="mt-4">
            <JobsMainContent onRefreshComplete={handleRefreshComplete} />
          </TabsContent>
          
          {/* Job Matching Chat Content */}
          <TabsContent value="chat" className="mt-4">
            <JobMatchingChat />
          </TabsContent>
          
          {/* Salary Analyzer Content */}
          <TabsContent value="salary" className="mt-4">
            <SalaryAnalyzer />
          </TabsContent>
          
          {/* Mentorship Content */}
          <TabsContent value="mentorship" className="mt-4">
            <Mentorship />
          </TabsContent>
          
          {/* Business Development Careers Content */}
          <TabsContent value="careers" className="mt-4">
            <JobsBizDevelopment />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default Jobs;
