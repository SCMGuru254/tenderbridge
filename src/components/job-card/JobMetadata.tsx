
import { MapPin, BriefcaseIcon, Clock } from "lucide-react";

interface JobMetadataProps {
  location: string | null;
  type: string | null;
  remainingTime?: string | null;
}

export const JobMetadata = ({ location, type, remainingTime }: JobMetadataProps) => {
  return (
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
      
      {remainingTime && (
        <div className="flex items-center space-x-1 text-amber-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Closing {remainingTime}</span>
        </div>
      )}
    </div>
  );
};
