
import { Link } from "react-router-dom";
import { MapPin, Globe, ArrowUpRight, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Company } from "@/pages/Companies";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="flex flex-col h-full">
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
  );
}
