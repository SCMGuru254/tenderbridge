
import { TrendingUp, MapPin, Globe } from "lucide-react";
import { RoleCard } from "./RoleCard";

export const SpecializedRolesTab = () => {
  return (
    <div className="space-y-4 mt-4">
      <RoleCard 
        title="Revenue Strategy Manager"
        icon={TrendingUp}
        responsibilities={[
          "Design sustainable monetization models (premium listings, featured employers, etc.)",
          "Develop pricing strategies appropriate for the Kenyan market",
          "Create financial projections and business growth models",
          "Identify opportunities for value-added services"
        ]}
      />

      <RoleCard 
        title="Regional Business Development Representatives"
        icon={MapPin}
        responsibilities={[
          "Focus on specific geographic regions within Kenya",
          "Build relationships with local businesses and community organizations",
          "Understand regional supply chain employment needs and challenges"
        ]}
      />

      <RoleCard 
        title="International Supply Chain Connector"
        icon={Globe}
        responsibilities={[
          "Build relationships with multinational companies establishing operations in Kenya",
          "Create pathways for Kenyan supply chain professionals to access international opportunities",
          "Connect with East African regional employers looking for Kenyan talent"
        ]}
      />
    </div>
  );
};
