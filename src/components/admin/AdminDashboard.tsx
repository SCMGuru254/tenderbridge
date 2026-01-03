import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
    CheckCircle2,
    Loader2,
    Banknote // More neutral for KES
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AdBanner } from "@/components/ads/AdBanner";
import { AdManager } from "./AdManager";
import { VideoManager } from "./VideoManager";
import { CompanyClaims } from "./CompanyClaims";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const fetchDashboardData = async () => {
    try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; 

        // 1. Fetch "God Mode" Tasks
        const { data: taskData, error: taskError } = await supabase
            .from('admin_pending_tasks')
            .select('*')
            .order('priority', { ascending: true }) // HIGH first
            .order('urgency_timestamp', { ascending: true }); // Oldest first
        
        if (taskError) throw taskError;
        setTasks(taskData || []);

        // 2. Fetch Affiliate Stats
        const { data: statData, error: statError } = await supabase
            .from('admin_affiliate_stats')
            .select('*')
            .order('total_sales', { ascending: false })
            .limit(10);

        if (statError) throw statError;
        setStats(statData || []);

    } catch (err: any) {
        console.error("Admin Load Error:", err);
        toast.error("Failed to load Admin Data");
    } finally {
        setLoading(false);
    }
  };

  const handleApprove = async (task: any) => {
      try {
          if (task.task_type === 'MANUAL_VERIFICATION') {
              const { error } = await supabase
                  .from('manual_payment_claims')
                  .update({ status: 'approved', admin_notes: 'Verified via Admin Dash' })
                  .eq('id', task.reference_id);
                  
              if (error) throw error;
              toast.success("Payment Verified! Course should auto-publish (via trigger).");
          } 
          else if (task.task_type === 'COURSE_APPROVAL') {
              const { error } = await supabase
                  .from('courses')
                  .update({ status: 'published' })
                  .eq('id', task.reference_id);
              if (error) throw error;
              toast.success("Course Published!");
          }
          else if (task.task_type === 'REWARD_REDEMPTION') {
              const notes = prompt("Enter fulfillment notes (e.g., 'CV reviewed and emailed'):");
              if (!notes) return;
              
              const { error } = await supabase
                  .from('redemption_requests')
                  .update({ status: 'fulfilled', admin_notes: notes })
                  .eq('id', task.reference_id);
              
              if (error) throw error;
              toast.success("Reward Fulfilled! User will be notified.");
          }
          
          fetchDashboardData();

      } catch (err: any) {
          toast.error("Action Failed: " + err.message);
      }
  };

  const handleReject = async (task: any) => {
      const reason = prompt("Enter Rejection Reason:");
      if (!reason) return;

      try {
        if (task.task_type === 'MANUAL_VERIFICATION') {
            await supabase.from('manual_payment_claims').update({ status: 'rejected', admin_notes: reason }).eq('id', task.reference_id);
        } else if (task.task_type === 'COURSE_APPROVAL') {
            await supabase.from('courses').update({ status: 'rejected' }).eq('id', task.reference_id);
        } else if (task.task_type === 'REWARD_REDEMPTION') {
            await supabase.from('redemption_requests').update({ status: 'rejected', admin_notes: reason }).eq('id', task.reference_id);
            // Note: Points were already deducted. Consider refund logic if needed.
        }
        toast.info("Task Rejected.");
        fetchDashboardData();
      } catch (err) {
          toast.error("Failed to reject.");
      }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER AD */}
      <AdBanner position="header" className="w-full h-[90px] overflow-hidden rounded-lg mb-6 shadow-sm" />

      {/* HEADER */}
      <div className="flex justify-between items-center">
          <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Command Center</h1>
              <p className="text-muted-foreground">"God Mode" Overview of Operations</p>
          </div>
          <Button onClick={fetchDashboardData} variant="outline">Refresh Data</Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-red-50 border-red-100">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-red-600 font-bold uppercase">Urgent Actions</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold text-red-700">{tasks.filter(t => t.priority === 'HIGH').length}</div></CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium uppercase flex items-center gap-2"><Banknote className="h-4 w-4 text-green-600"/> Pending Revenue</CardTitle></CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold">
                      KES {stats.reduce((acc: number, curr: any) => acc + (curr.total_sales * 5000), 0).toLocaleString()}
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium uppercase">Active Partners</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold">{stats.length}</div></CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium uppercase flex items-center gap-2"><Banknote className="h-4 w-4 text-blue-600"/> Total Payouts Due</CardTitle></CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                      KES {stats.reduce((acc: number, curr: any) => acc + (curr.total_commission_owed || 0), 0).toLocaleString()}
                  </div>
              </CardContent>
          </Card>
      </div>

      <Tabs defaultValue="inbox" className="space-y-4">
          <TabsList>
              <TabsTrigger value="inbox">Inbox ({tasks.length})</TabsTrigger>
              <TabsTrigger value="partners">Growth Partners</TabsTrigger>
              <TabsTrigger value="ads">Ad Management</TabsTrigger>
              <TabsTrigger value="videos">Video Library</TabsTrigger>
              <TabsTrigger value="claims">Business Claims</TabsTrigger>
              <TabsTrigger value="reports">Content Reports ({tasks.filter(t => t.task_type === 'CONTENT_REPORT').length})</TabsTrigger>
          </TabsList>

          {/* INBOX TAB */}
          <TabsContent value="inbox" className="space-y-4">
              <div className="grid gap-4">
                  {tasks.length === 0 ? (
                      <div className="p-12 text-center border rounded-lg bg-gray-50 border-dashed">
                          <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                          <h3 className="text-lg font-medium">All Clear!</h3>
                          <p className="text-muted-foreground">No urgent tasks pending.</p>
                      </div>
                  ) : (
                      tasks.map((task, idx) => (
                          <Card key={idx} className={`border-l-4 ${task.priority === 'HIGH' ? 'border-l-red-500 shadow-md' : 'border-l-blue-500'}`}>
                              <CardContent className="p-6 flex items-center justify-between">
                                  <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                          {task.priority === 'HIGH' && <Badge variant="destructive">URGENT</Badge>}
                                          <Badge variant="outline">{task.task_type.replace('_', ' ')}</Badge>
                                          <span className="text-sm text-muted-foreground">
                                              {formatDistanceToNow(new Date(task.urgency_timestamp), { addSuffix: true })}
                                          </span>
                                      </div>
                                      <p className="font-semibold text-lg">{task.description}</p>
                                      <p className="text-xs text-muted-foreground font-mono">ID: {task.reference_id}</p>
                                  </div>
                                  <div className="flex gap-2">
                                      <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleReject(task)}>
                                          Reject
                                      </Button>
                                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(task)}>
                                          Approve / Verify
                                      </Button>
                                  </div>
                              </CardContent>
                          </Card>
                      ))
                  )}
              </div>
          </TabsContent>

          {/* PARTNERS TAB */}
          <TabsContent value="partners">
              <Card>
                  <CardHeader>
                      <CardTitle>Top Performing Partners</CardTitle>
                      <CardDescription>Sales Leaders & Commission Status</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ScrollArea className="h-[400px]">
                          <table className="w-full text-sm text-left">
                              <thead className="text-muted-foreground border-b bg-gray-50">
                                  <tr>
                                      <th className="p-4 font-medium">Partner Code</th>
                                      <th className="p-4 font-medium">Tier</th>
                                      <th className="p-4 font-medium text-right">Signups</th>
                                      <th className="p-4 font-medium text-right">Sales</th>
                                      <th className="p-4 font-medium text-right">Commission Owed</th>
                                      <th className="p-4 font-medium text-right">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y">
                                  {stats.map((partner: any) => (
                                      <tr key={partner.affiliate_code} className="hover:bg-gray-50/50">
                                          <td className="p-4 font-mono font-medium">{partner.affiliate_code}</td>
                                          <td className="p-4">
                                              <Badge variant="secondary" className={
                                                  partner.tier === 'platinum' ? 'bg-purple-100 text-purple-700' :
                                                  partner.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                                                  'bg-gray-100 text-gray-700'
                                              }>
                                                  {partner.tier.toUpperCase()}
                                              </Badge>
                                          </td>
                                          <td className="p-4 text-right">{partner.total_signups}</td>
                                          <td className="p-4 text-right font-bold">{partner.total_sales}</td>
                                          <td className="p-4 text-right text-blue-600 font-medium">
                                              KES {(partner.total_commission_owed || 0).toLocaleString()}
                                          </td>
                                          <td className="p-4 text-right">
                                              <Button size="sm" variant="outline">Pay Details</Button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </ScrollArea>
                  </CardContent>
              </Card>
          </TabsContent>

          {/* ADS MANAGEMENT TAB */}
          <TabsContent value="ads">
            <AdManager />
          </TabsContent>
          {/* VIDEO MANAGEMENT TAB */}
          <TabsContent value="videos">
            <VideoManager />
          </TabsContent>
          <TabsContent value="claims">
            <CompanyClaims />
          </TabsContent>
          {/* REPORTS TAB */}
          <TabsContent value="reports">
            <Card>
                <CardHeader>
                    <CardTitle>Content Reports</CardTitle>
                    <CardDescription>User reported content requiring moderation</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tasks.filter(t => t.task_type === 'CONTENT_REPORT').length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                No reports pending review.
                            </div>
                        ) : (
                            tasks.filter(t => t.task_type === 'CONTENT_REPORT').map((task, idx) => (
                                <Card key={idx}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <Badge variant="destructive" className="mb-2">REPORTED</Badge>
                                            <p className="font-semibold">{task.description}</p>
                                            <p className="text-sm text-muted-foreground">Reported {formatDistanceToNow(new Date(task.urgency_timestamp))} ago</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleApprove(task)}>Ignore</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleReject(task)}>Delete Content</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
    </div>
  );
}
