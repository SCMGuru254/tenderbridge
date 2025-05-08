
import { Building2, Users, BriefcaseIcon } from "lucide-react";
import { RoleCard } from "./RoleCard";

export const CoreRolesTab = () => {
  return (
    <div className="space-y-4 mt-4">
      <RoleCard 
        title="Partnerships Manager"
        icon={Building2}
        responsibilities={[
          "Identify and secure partnerships with major Kenyan employers in logistics, manufacturing, retail, and agricultural supply chains",
          "Negotiate exclusive job posting agreements with companies like Safaricom, Kenya Airways, and major retailers",
          "Build relationships with government agencies like Kenya Ports Authority for public sector opportunities",
          "Create revenue-sharing models with complementary job platforms",
          "Develop corporate subscription packages for premium employers"
        ]}
      />

      <RoleCard 
        title="User Acquisition Specialist"
        icon={Users}
        responsibilities={[
          "Implement targeted digital campaigns across Kenyan social media platforms",
          "Organize physical job fairs in major Kenyan cities (Nairobi, Mombasa, Kisumu)",
          "Create referral programs to incentivize user growth",
          "Develop university partnerships to reach supply chain graduates",
          "Track and optimize user acquisition costs and conversion rates",
          "Design SMS campaigns to reach candidates without consistent internet access"
        ]}
      />

      <RoleCard 
        title="Customer Success Representative"
        icon={BriefcaseIcon}
        responsibilities={[
          "Provide multilingual support in English, Swahili, and major local languages",
          "Create educational resources for job seekers on supply chain career paths",
          "Assist employers with optimizing job listings for better candidate matches",
          "Collect user feedback to inform product development",
          "Monitor and improve user retention metrics"
        ]}
      />
    </div>
  );
};
