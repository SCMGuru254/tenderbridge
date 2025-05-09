
import { RoleCard } from "./RoleCard";
import { Users, Briefcase, Globe } from "lucide-react";

export const SpecializedRolesTab = () => {
  return (
    <div className="space-y-4 mt-4">
      <RoleCard 
        title="Partnerships Manager"
        icon={Users}
        responsibilities={[
          "Develop strategic partnerships with key industry players",
          "Represent the platform at industry events and conferences",
          "Create partnership agreements that drive mutual value",
          "Collaborate with leadership on business development strategies",
          "Track partnership performance metrics and report on outcomes"
        ]}
      />

      <RoleCard 
        title="Recruiting Specialist"
        icon={Briefcase}
        responsibilities={[
          "Screen and qualify supply chain candidates",
          "Assist employers with job description optimization",
          "Provide guidance on industry-specific hiring best practices",
          "Build relationships with supply chain educational institutions",
          "Offer career coaching to supply chain professionals"
        ]}
      />

      <RoleCard 
        title="International Markets Coordinator"
        icon={Globe}
        responsibilities={[
          "Research regional supply chain job markets",
          "Adapt platform features for different market needs",
          "Establish connections with supply chain associations",
          "Monitor job trends in African supply chain sectors",
          "Provide insights for cross-border opportunities"
        ]}
      />
    </div>
  );
};
