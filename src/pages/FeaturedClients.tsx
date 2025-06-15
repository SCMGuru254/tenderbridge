
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeaturedClientForm } from '@/components/featured-clients/FeaturedClientForm';
import { FeaturedClientsList } from '@/components/featured-clients/FeaturedClientsList';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturedClients = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to apply for featured client services.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Featured Client Services</h1>
        
        <Tabs defaultValue="apply" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="apply">Apply for Services</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="apply" className="mt-6">
            <FeaturedClientForm />
          </TabsContent>
          
          <TabsContent value="applications" className="mt-6">
            <FeaturedClientsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeaturedClients;
