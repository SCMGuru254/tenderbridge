import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface FreeService {
  id: string;
  type: "cv_review" | "coaching";
  status: "available" | "redeemed" | "completed";
  coach_id: string;
  coach_name: string;
  coach_specialization: string;
  created_at: string;
  redeemed_at?: string;
  completed_at?: string;
}

export default function FreeServices() {
  const [services, setServices] = useState<FreeService[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("free_services")
        .select(`
          *,
          coaches:coach_id (
            name,
            specialization
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setServices(data.map(service => ({
        ...service,
        coach_name: service.coaches.name,
        coach_specialization: service.coaches.specialization
      })));
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from("free_services")
        .update({
          status: "redeemed",
          redeemed_at: new Date().toISOString()
        })
        .eq("id", serviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service redeemed successfully"
      });

      fetchServices();
    } catch (error) {
      console.error("Error redeeming service:", error);
      toast({
        title: "Error",
        description: "Failed to redeem service",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Free Services</h1>
      
      <Tabs defaultValue="available">
        <TabsList className="mb-4">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="redeemed">Redeemed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="grid gap-6">
            {services
              .filter(service => service.status === "available")
              .map(service => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle>
                      {service.type === "cv_review" ? "CV Review" : "Career Coaching"}
                    </CardTitle>
                    <CardDescription>
                      with {service.coach_name} - {service.coach_specialization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Available until {format(new Date(service.created_at), "MMM d, yyyy")}
                      </p>
                      <Button onClick={() => redeemService(service.id)}>
                        Redeem Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="redeemed">
          <div className="grid gap-6">
            {services
              .filter(service => service.status === "redeemed")
              .map(service => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle>
                      {service.type === "cv_review" ? "CV Review" : "Career Coaching"}
                    </CardTitle>
                    <CardDescription>
                      with {service.coach_name} - {service.coach_specialization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Redeemed on {format(new Date(service.redeemed_at!), "MMM d, yyyy")}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6">
            {services
              .filter(service => service.status === "completed")
              .map(service => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle>
                      {service.type === "cv_review" ? "CV Review" : "Career Coaching"}
                    </CardTitle>
                    <CardDescription>
                      with {service.coach_name} - {service.coach_specialization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Completed on {format(new Date(service.completed_at!), "MMM d, yyyy")}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 