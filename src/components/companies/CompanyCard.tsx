
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

export interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    description?: string | null;
    location?: string | null;
    website?: string | null;
    verification_status?: string | null;
  };
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{company.name}</CardTitle>
          {company.verification_status && (
            <Badge variant={company.verification_status === "verified" ? "secondary" : "outline"}>
              {company.verification_status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {company.description && (
          <p className="text-muted-foreground line-clamp-3">
            {company.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {company.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{company.location}</span>
            </div>
          )}
          
          {company.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <a 
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Website
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>View Profile</span>
          </div>
          
          <Button asChild size="sm">
            <Link to={`/companies/${company.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
