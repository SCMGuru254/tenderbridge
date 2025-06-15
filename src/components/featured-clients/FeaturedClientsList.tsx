
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFeaturedClients } from '@/hooks/useFeaturedClients';

export const FeaturedClientsList = () => {
  const { featuredClients, loading } = useFeaturedClients();

  if (loading) {
    return <div>Loading your applications...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Featured Client Applications</h2>
      
      {featuredClients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No applications submitted yet.</p>
          </CardContent>
        </Card>
      ) : (
        featuredClients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{client.company_name}</CardTitle>
                  <CardDescription>{client.intent_type.replace('_', ' ')}</CardDescription>
                </div>
                <Badge variant={
                  client.status === 'approved' ? 'default' :
                  client.status === 'active' ? 'secondary' :
                  client.status === 'pending' ? 'outline' : 'destructive'
                }>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Contact:</strong> {client.contact_person}</p>
                  <p><strong>Email:</strong> {client.company_email}</p>
                  {client.phone_number && (
                    <p><strong>Phone:</strong> {client.phone_number}</p>
                  )}
                </div>
                <div>
                  <p><strong>Budget Range:</strong> {client.budget_range}</p>
                  {client.subscription_type && (
                    <p><strong>Billing:</strong> {client.subscription_type}</p>
                  )}
                  <p><strong>Applied:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {client.status === 'active' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Active Campaign</h4>
                  {client.ad_views_purchased && (
                    <p className="text-sm text-green-700">
                      Views: {client.ad_views_used || 0} / {client.ad_views_purchased}
                    </p>
                  )}
                  {client.start_date && client.end_date && (
                    <p className="text-sm text-green-700">
                      Period: {client.start_date} to {client.end_date}
                    </p>
                  )}
                </div>
              )}
              
              {client.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm"><strong>Notes:</strong> {client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
