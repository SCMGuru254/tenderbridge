
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Search, Building, MapPin, Globe, ArrowUpRight, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Company {
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
            Discover supply chain companies and explore their profiles
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
                <SelectItem key={status} value={status}>
                  {status?.charAt(0).toUpperCase() + status?.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-700">About the Companies Directory</h3>
            <p className="text-sm text-blue-600">
              Browse through verified supply chain companies. Connect with potential partners, 
              find job opportunities, and stay updated with companies in the supply chain industry. 
              Company profiles include contact information, location details, and reviews from current and former employees.
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
            <Card key={company.id} className="flex flex-col h-full">
              <CardContent className="pt-6 flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                
                {company.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {company.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic mb-4">No description available</p>
                )}
                
                <div className="mt-auto space-y-2">
                  {company.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  
                  {company.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline flex items-center">
                        {company.website.replace(/^https?:\/\//, '').split('/')[0]}
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                  
                  {company.verification_status && (
                    <Badge variant={company.verification_status === "verified" ? "secondary" : 
                                    company.verification_status === "pending" ? "outline" : "default"}>
                      {company.verification_status.charAt(0).toUpperCase() + company.verification_status.slice(1)}
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/companies/${company.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
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
