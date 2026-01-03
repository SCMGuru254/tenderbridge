import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle, XCircle, Trash2, Clock, Flag, Trash } from "lucide-react";
import { format } from "date-fns";
import { ReportAnalytics } from "@/components/admin/ReportAnalytics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Report {
  id: string;
  content_id: string;
  content_type: string;
  reason: string;
  details: string;
  status: string;
  reported_at: string;
  reported_by: string;
  profiles?: { full_name: string };
}

interface SpamContent {
  id: string;
  table_name: string;
  content_type: string;
  title?: string;
  flagged_at: string;
}

interface ReportAnalytics {
  total_reports: number;
  pending_reports: number;
  approved_reports: number;
  rejected_reports: number;
  top_reasons: { reason: string; count: number }[];
  reports_by_type: { type: string; count: number }[];
}

interface ScheduledReview {
  id: string;
  content_id: string;
  content_type: string;
  scheduled_for: string;
  status: string;
}

export function ContentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [scheduledReviews, setScheduledReviews] = useState<ScheduledReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [spamContent, setSpamContent] = useState<SpamContent[]>([]);

  useEffect(() => {
    fetchReports();
    fetchScheduledReviews();
    fetchSpamContent();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('content_reports')
        .select(`
          *,
          profiles:reported_by (full_name)
        `)
        .order('reported_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('scheduled_reviews')
        .select('*')
        .eq('status', 'pending')
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      setScheduledReviews(data || []);
    } catch (error) {
      console.error("Error fetching scheduled reviews:", error);
    }
  };

  const fetchSpamContent = async () => {
    try {  
      // Fetch jobs marked as spam
      const { data: spamJobs, error: jobsError } = await supabase
        .from('scraped_jobs')
        .select('id, title, created_at')
        .eq('is_scam', true);
      
      if (jobsError) throw jobsError;

      const spam: SpamContent[] = (spamJobs || []).map(job => ({
        id: job.id,
        table_name: 'scraped_jobs',
        content_type: 'job',
        title: job.title,
        flagged_at: job.created_at
      }));

      setSpamContent(spam);
    } catch (error) {
      console.error("Error fetching spam content:", error);
    }
  };



  const handleApproveReport = async (report: Report) => {
    setSelectedReport(report);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteContent = async () => {
    if (!selectedReport) return;

    try {
      // Determine the table name
      const tableMap: Record<string, string> = {
        job: 'scraped_jobs',
        review: 'company_reviews',
        discussion: 'discussions',
        profile: 'profiles'
      };

      const tableName = tableMap[selectedReport.content_type];
      
      if (!tableName) {
        throw new Error(`Unknown content type: ${selectedReport.content_type}`);
      }

      // Delete the content
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', selectedReport.content_id);

      if (deleteError) throw deleteError;

      // Update report status
      const { error: updateError } = await supabase
        .from('content_reports')
        .update({ status: 'approved' })
        .eq('id', selectedReport.id);

      if (updateError) throw updateError;

      toast.success("Content deleted successfully");
      fetchReports();
      setDeleteDialogOpen(false);
      setSelectedReport(null);
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast.error(error.message || "Failed to delete content");
    }
  };

  const handleRejectReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('content_reports')
        .update({ status: 'rejected' })
        .eq('id', reportId);

      if (error) throw error;

      toast.success("Report rejected");
      fetchReports();
    } catch (error) {
      console.error("Error rejecting report:", error);
      toast.error("Failed to reject report");
    }
  };

  const handleCancelScheduledReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_reviews')
        .update({ status: 'cancelled' })
        .eq('id', reviewId);

      if (error) throw error;

      toast.success("Scheduled review cancelled");
      fetchScheduledReviews();
    } catch (error) {
      console.error("Error cancelling review:", error);
      toast.error("Failed to cancel review");
    }
  };

  const getStatusBadge = (status: string) => {
    let style: { variant: "outline" | "default" | "secondary"; icon: any };
    
    switch (status) {
      case 'approved':
        style = { variant: "default", icon: CheckCircle };
        break;
      case 'rejected':
        style = { variant: "secondary", icon: XCircle };
        break;
      case 'pending':
      default:
        style = { variant: "outline", icon: Clock };
        break;
    }

    const Icon = style.icon;

    return (
      <Badge variant={style.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const processedReports = reports.filter(r => r.status !== 'pending');

  if (loading) {
    return <div className="flex justify-center p-8">Loading reports...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Content Moderation
          </CardTitle>
          <CardDescription>
            Review and manage reported content and scheduled deletions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending">
                Pending ({pendingReports.length})
              </TabsTrigger>
              <TabsTrigger value="spam">
                Spam ({spamContent.length})
              </TabsTrigger>
              <TabsTrigger value="processed">
                Processed ({processedReports.length})
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                Scheduled ({scheduledReviews.length})
              </TabsTrigger>
              <TabsTrigger value="analytics">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingReports.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending reports
                </p>
              ) : (
                pendingReports.map((report) => (
                  <Card key={report.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{report.content_type}</Badge>
                              <span className="text-sm text-muted-foreground">
                                ID: {report.content_id.slice(0, 8)}...
                              </span>
                            </div>
                            <p className="font-semibold text-red-600">{report.reason}</p>
                            {report.details && (
                              <p className="text-sm text-muted-foreground">{report.details}</p>
                            )}
                          </div>
                          {getStatusBadge(report.status)}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Reported by: {report.profiles?.full_name || 'Unknown'}</span>
                          <span>•</span>
                          <span>{format(new Date(report.reported_at), 'PPp')}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproveReport(report)}
                            className="flex-1"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Content
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectReport(report.id)}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="spam" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Content automatically flagged as spam (3+ reports)
                </p>
                {spamContent.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (confirm(`Delete all ${spamContent.length} spam items?`)) {
                        try {
                          for (const spam of spamContent) {
                            await supabase.from(spam.table_name).delete().eq('id', spam.id);
                          }
                          toast.success("Bulk deletion complete");
                          fetchSpamContent();
                        } catch (error) {
                          toast.error("Bulk deletion failed");
                        }
                      }
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete All
                  </Button>
                )}
              </div>

              {spamContent.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No spam content detected
                </p>
              ) : (
                spamContent.map((spam) => (
                  <Card key={spam.id} className="border-l-4 border-l-red-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">{spam.content_type}</Badge>
                            <span className="text-sm font-medium">{spam.title || 'Untitled'}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Flagged: {format(new Date(spam.flagged_at), 'PPp')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            if (confirm('Delete this spam content?')) {
                              try {
                                await supabase.from(spam.table_name).delete().eq('id', spam.id);
                                toast.success("Spam deleted");
                                fetchSpamContent();
                              } catch (error) {
                                toast.error("Failed to delete");
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="processed" className="space-y-4">
              {processedReports.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No processed reports
                </p>
              ) : (
                processedReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{report.content_type}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(report.reported_at), 'PP')}
                            </span>
                          </div>
                          <p className="font-semibold">{report.reason}</p>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              {scheduledReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No scheduled reviews
                </p>
              ) : (
                scheduledReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Badge variant="outline">{review.content_type}</Badge>
                          <p className="text-sm">
                            Scheduled deletion: {format(new Date(review.scheduled_for), 'PPp')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Content ID: {review.content_id.slice(0, 8)}...
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelScheduledReview(review.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <ReportAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirm Content Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {selectedReport?.content_type} from the platform.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteContent}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Content
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
