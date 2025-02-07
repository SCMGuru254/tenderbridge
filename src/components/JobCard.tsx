
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, BriefcaseIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  title: string;
  company: string | null;
  location: string | null;
  type: string | null;
  category: string | null;
}

export const JobCard = ({ title, company, location, type, category }: JobCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {company && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            <span>{company}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{location}</span>
              </div>
            )}
            {type && (
              <div className="flex items-center space-x-1">
                <BriefcaseIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{type}</span>
              </div>
            )}
          </div>
          {category && (
            <div className="flex space-x-2">
              <Badge variant="secondary">{category}</Badge>
            </div>
          )}
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => navigate(`/jobs/apply`)}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
