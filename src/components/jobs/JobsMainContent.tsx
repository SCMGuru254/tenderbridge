
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useJobData } from '@/hooks/useJobData';
import { Link } from "react-router-dom";

interface JobsMainContentProps {
  onRefreshComplete?: () => void;
}

export const JobsMainContent = ({ onRefreshComplete }: JobsMainContentProps) => {
  const { postedJobs, aggregatedJobs, refetchPostedJobs, refetchAggregatedJobs } = useJobData();

  const handleRefresh = async () => {
    await Promise.all([refetchPostedJobs(), refetchAggregatedJobs()]);
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

      <div className="grid gap-6">
        <section>
          <h3 className="text-lg font-semibold mb-4">Posted Jobs ({postedJobs.length})</h3>
          {postedJobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {postedJobs.map((job: any) => (
                <Link key={job.id} to={`/job/${job.id}`} className="block h-full">
                  <Card className="hover-elevate h-full cursor-pointer transition-colors border-primary/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base line-clamp-2">{job.title}</CardTitle>
                        {job.salary && (
                          <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase shrink-0">
                            {job.salary}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">{job.company || 'SupplyChain KE'}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-3">{job.location}</p>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="w-full text-xs h-8">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                No posted jobs found
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">Aggregated Jobs ({aggregatedJobs.length})</h3>
          {aggregatedJobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aggregatedJobs.map((job: any) => (
                <Link key={job.id} to={`/job/${job.id}`} className="block h-full">
                  <Card className="hover-elevate h-full cursor-pointer transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base line-clamp-2">{job.title}</CardTitle>
                      <p className="text-xs text-muted-foreground font-medium">{job.company}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-3">{job.location}</p>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="w-full text-xs h-8">View External</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                No aggregated jobs found
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};
