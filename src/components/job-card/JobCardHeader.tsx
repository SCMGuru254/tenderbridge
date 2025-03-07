
import { Building2 } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface JobCardHeaderProps {
  title: string;
  company: string | null;
}

export const JobCardHeader = ({ title, company }: JobCardHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      {company && (
        <div className="flex items-center space-x-2 text-gray-600">
          <Building2 className="w-4 h-4" />
          <span>{company}</span>
        </div>
      )}
    </CardHeader>
  );
};
