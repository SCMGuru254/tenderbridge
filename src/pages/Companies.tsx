
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Building, Info, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { toast } from "sonner";
import CompanyCard from "@/components/companies/CompanyCard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CompanySignupForm } from "@/components/companies/CompanySignupForm";
import { Plus } from "lucide-react";

export interface Company {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  website: string | null;
  verification_status: string | null;
}

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log("Fetching companies...");
      const { data, error } = await supabase
        .from('companies')
        .select('*');
        
      if (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies data");
        throw error;
      }
      
      console.log("Companies data:", data);
      return data as Company[];
    }
  });
  
  // Filter companies based on search term and status filter
  const filteredCompanies = companies?.filter(company => {
    const matchesSearch = !searchTerm || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.location && company.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = !statusFilter || statusFilter === "all" || company.verification_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get unique verification statuses for filtering
  const statuses = companies 
    ? [...new Set(companies.map(company => company.verification_status).filter(Boolean))]
    : [];
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-muted-foreground mt-1">
            Browse through verified supply chain companies, read reviews, and connect with potential partners
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status || 'unknown'} value={status || 'unknown'}>
                  {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add a Company</DialogTitle>
              </DialogHeader>
              <CompanySignupForm 
                onSuccess={() => {
                  setIsAddCompanyOpen(false);
                  window.location.reload();
                }}
                onCancel={() => setIsAddCompanyOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-700">About the Companies Directory</h3>
            <p className="text-sm text-blue-600">
              Browse through verified supply chain companies. Read reviews from current and former employees, 
              connect with potential partners, and find job opportunities. Company profiles include 
              detailed information about work culture, benefits, and employee experiences.
            </p>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col animate-pulse">
              <CardContent className="pt-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 mt-auto">
                <div className="h-9 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium">Error loading companies</h3>
          <p className="text-muted-foreground mt-2">
            We couldn't load the companies data. Please try again later.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline" 
            className="mt-4"
          >
            Refresh
          </Button>
        </div>
      ) : filteredCompanies?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 text-lg font-medium">No companies found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm || statusFilter ? 
              "Try adjusting your search or filters" : 
              "No companies have been registered yet"}
          </p>
        </div>
      )}
    </div>
  );
}
