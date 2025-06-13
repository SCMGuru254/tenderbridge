import { useUser } from '@/hooks/useUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Check, Clock, Users2, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useConnections } from '@/hooks/useNetworking';

export default function ConnectionsManager() {
  const { user } = useUser();
  const { connections, isLoading, respondToRequest } = useConnections(user?.id || '');

  if (!user) return null;

  const pendingRequests = connections.filter(c => c.status === 'pending' && c.target_id === user.id);
  const activeConnections = connections.filter(c => c.status === 'accepted');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Connection Requests</CardTitle>
            <CardDescription>
              {pendingRequests.length} people want to connect with you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{request.requestor_id}</h4>
                    <p className="text-sm text-muted-foreground">
                      Sent {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => respondToRequest({ connectionId: request.id, status: 'accepted' })}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => respondToRequest({ connectionId: request.id, status: 'rejected' })}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Network</CardTitle>
          <CardDescription>
            {activeConnections.length} connections in your professional network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users2 className="h-4 w-4" />
                  <CardTitle>Connections</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeConnections.length}</div>
                <p className="text-sm text-muted-foreground">Total connections</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <CardTitle>Pending</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                <p className="text-sm text-muted-foreground">Pending requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <CardTitle>Network Strength</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.min(10, Math.floor(activeConnections.length / 10))}
                </div>
                <p className="text-sm text-muted-foreground">Out of 10</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
