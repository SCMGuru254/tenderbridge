
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ExpiryAlert = () => {
  return (
    <Alert variant="default" className="bg-amber-50 border-amber-200">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-700">
        Community posts are available for 30 days from the date of posting and will be automatically removed afterward.
      </AlertDescription>
    </Alert>
  );
};
