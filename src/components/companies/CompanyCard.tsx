
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ExternalLink } from "lucide-react";

interface CompanyCardProps {
  id: string;
  name: string;
  location?: string;
  description?: string;
  website?: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  onClick?: () => void;
}

const CompanyCard = ({ 
  name, 
  location, 
  description, 
  website, 
  verificationStatus = 'pending',
  onClick 
}: CompanyCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge 
            variant={verificationStatus === 'verified' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {verificationStatus}
          </Badge>
        </div>
        {location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Supply Chain Team</span>
          </div>
          
          {website && (
            <Button variant="ghost" size="sm" asChild>
              <a href={website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
