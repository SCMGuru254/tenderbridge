import React from 'react';
import { useCompanyProfile } from '@/hooks/useCompany';
import type { CompanyMember } from '@/types/company';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Globe, MapPin, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyReviews } from "@/components/companies/CompanyReviews";
import { Company } from "@/pages/Companies";

export default function CompanyProfile() {
  const { id } = useParams<{ id: string }>();

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
      return data as Company;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2 mb-8">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-lg font-medium">Error loading company profile</h2>
        <p className="text-muted-foreground mt-2">
          We couldn't load this company's information. Please try again later.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline" 
          className="mt-4"
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
              {company.verification_status && (
                <Badge variant={company.verification_status === "verified" ? "secondary" : 
                                company.verification_status === "pending" ? "outline" : "default"}>
                  {company.verification_status.charAt(0).toUpperCase() + company.verification_status.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
          {company.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{company.location}</span>
            </div>
          )}
          
          {company.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <a 
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {company.description && (
          <div className="prose max-w-none">
            <p>{company.description}</p>
          </div>
        )}
      </div>

      <div className="border-t pt-8">
        <CompanyReviews companyId={company.id} />
      </div>
    </div>
  );
}
