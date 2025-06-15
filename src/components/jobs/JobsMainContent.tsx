
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useJobData } from '@/hooks/useJobData';

interface JobsMainContentProps {
  onRefreshComplete?: () => void;
}

export const JobsMainContent = ({ onRefreshComplete }: JobsMainContentProps) => {
  const { postedJobs, scrapedJobs, refetchPostedJobs, refetchScrapedJobs } = useJobData();

  const handleRefresh = async () => {
    await Promise.all([refetchPostedJobs(), refetchScrapedJobs()]);
    onRefreshComplete?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Listings</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Posted Jobs ({postedJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {postedJobs.length > 0 ? (
              <div className="space-y-2">
                {postedJobs.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="p-3 border rounded-lg">
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No posted jobs found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scraped Jobs ({scrapedJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {scrapedJobs.length > 0 ? (
              <div className="space-y-2">
                {scrapedJobs.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="p-3 border rounded-lg">
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No scraped jobs found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
