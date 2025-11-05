import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Users, 
  Clock, 
  Check, 
  X, 
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Connection {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  user_id1: string;
  user_id2: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    position: string | null;
    company: string | null;
  };
}

export const ConnectionManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadConnections();
      loadPendingRequests();
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          profiles:user_id2 (
            full_name,
            avatar_url,
            position,
            company
          )
        `)
        .eq('user_id1', user?.id)
        .eq('status', 'accepted');

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast.error('Failed to load connections');
    }
  };

  const loadPendingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          profiles:user_id1 (
            full_name,
            avatar_url,
            position,
            company
          )
        `)
        .eq('user_id2', user?.id)
        .eq('status', 'pending');

      if (error) throw error;
      setPendingRequests(data || []);
    } catch (error) {
      console.error('Error loading pending requests:', error);
      toast.error('Failed to load connection requests');
    }
  };

  const handleConnectionAction = async (connectionId: string, action: 'accept' | 'reject') => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
        .eq('id', connectionId);

      if (error) throw error;

      toast.success(`Connection ${action === 'accept' ? 'accepted' : 'rejected'}`);
      loadPendingRequests();
      if (action === 'accept') loadConnections();
    } catch (error) {
      console.error('Error updating connection:', error);
      toast.error('Failed to update connection');
    }
  };

  const handleConnect = async (targetUserId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          user_id1: user?.id,
          user_id2: targetUserId,
          status: 'pending'
        });

      if (error) throw error;
      toast.success('Connection request sent');
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      // Get existing connections to exclude
      const { data: existingConnections } = await supabase
        .from('connections')
        .select('user_id2')
        .eq('user_id1', user?.id)
        .in('status', ['accepted', 'pending']);

      const excludeIds = existingConnections?.map(c => c.user_id2) || [];
      excludeIds.push(user?.id!); // Exclude current user

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, position, company')
        .ilike('full_name', `%${query}%`)
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for connections..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback>
                              {user.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{user.full_name}</h4>
                            {user.position && (
                              <p className="text-sm text-muted-foreground">
                                {user.position} at {user.company}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnect(user.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            <Users className="h-4 w-4 mr-2" />
            All Connections
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            Pending Requests
            {pendingRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggested">
            <UserPlus className="h-4 w-4 mr-2" />
            Suggested
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {connections.length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start building your professional network
                </p>
              </CardContent>
            </Card>
          ) : (
            connections.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={connection.profiles.avatar_url || ''} />
                        <AvatarFallback>
                          {connection.profiles.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{connection.profiles.full_name}</h4>
                        {connection.profiles.position && (
                          <p className="text-sm text-muted-foreground">
                            {connection.profiles.position} at {connection.profiles.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up!
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={request.profiles.avatar_url || ''} />
                        <AvatarFallback>
                          {request.profiles.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{request.profiles.full_name}</h4>
                        {request.profiles.position && (
                          <p className="text-sm text-muted-foreground">
                            {request.profiles.position} at {request.profiles.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600"
                        onClick={() => handleConnectionAction(request.id, 'accept')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleConnectionAction(request.id, 'reject')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="suggested" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Find Connections</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use the search bar above to find and connect with professionals in your industry
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
