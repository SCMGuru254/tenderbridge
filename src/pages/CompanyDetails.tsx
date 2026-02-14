
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyReviews } from "@/components/companies/CompanyReviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Loader2, ArrowLeft, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      if (!id) throw new Error("Company ID is required");
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The company you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/companies')}>
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/companies')}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Companies
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Company Info Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                {company.verification_status && (
                  <Badge variant={company.verification_status === "verified" ? "secondary" : "outline"}>
                    {company.verification_status}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{company.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{company.location}</span>
                </div>
              )}
              
              {company.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              
              {company.description && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-sm text-muted-foreground">
                    {company.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Company Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyReviews companyId={company.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
