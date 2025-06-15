
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFeaturedClients } from '@/hooks/useFeaturedClients';

export const FeaturedClientsList = () => {
  const { featuredClients, loading } = useFeaturedClients();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!featuredClients.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No applications found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {featuredClients.map((client) => (
        <Card key={client.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{client.company_name}</CardTitle>
              <Badge variant={client.status === 'approved' ? 'default' : 'secondary'}>
                {client.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Service Type:</span> {client.intent_type}
              </div>
              <div>
                <span className="font-medium">Budget:</span> {client.budget_range}
              </div>
              <div>
                <span className="font-medium">Contact:</span> {client.contact_person}
              </div>
              <div>
                <span className="font-medium">Applied:</span> {new Date(client.created_at).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
