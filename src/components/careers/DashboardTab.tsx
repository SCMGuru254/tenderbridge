
import { PieChart, BarChart, LineChart } from "lucide-react";
import { RoleCard } from "./RoleCard";

export const DashboardTab = () => {
  return (
    <div className="space-y-4 mt-4">
      <RoleCard 
        title="Revenue Tracking Dashboard"
        icon={PieChart}
        responsibilities={[
          "Monitor all revenue streams in real-time",
          "Track premium job listings and featured profiles",
          "Analyze corporate subscription packages performance",
          "View candidate database access metrics",
          "Track sponsored industry reports metrics"
        ]}
      />

      <RoleCard 
        title="Value-Added Services Dashboard"
        icon={BarChart}
        responsibilities={[
          "Track resume building & optimization usage",
          "Monitor AI-based candidate matching metrics",
          "Organize and track job fair registrations",
          "Analyze supply chain salary data trends",
          "Manage industry certification tracking"
        ]}
      />

      <RoleCard 
        title="Performance Analytics"
        icon={LineChart}
        responsibilities={[
          "Track user engagement and conversion rates",
          "Monitor payment processing through PayPal integration",
          "Analyze revenue growth across all streams",
          "Generate performance reports for stakeholders",
          "Set and track KPIs for business development goals"
        ]}
      />
    </div>
  );
};
