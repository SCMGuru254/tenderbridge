
import { PieChart, BarChart, LineChart, DollarSign, UserCheck } from "lucide-react";
import { RoleCard } from "./RoleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export const DashboardTab = () => {
  // Sample revenue data for demonstration
  const revenueStreams = [
    { name: 'Premium Job Listings', category: 'Primary', price: '200 KSH' },
    { name: 'Featured Company Profiles', category: 'Primary', price: '300 KSH' },
    { name: 'Corporate Subscription', category: 'Primary', price: '1000 KSH' },
    { name: 'Candidate Database Access', category: 'Primary', price: '500 KSH' },
    { name: 'Sponsored Industry Reports', category: 'Primary', price: '800 KSH' },
    { name: 'Resume Building', category: 'Value-Added', price: '100 KSH' },
    { name: 'AI Candidate Matching', category: 'Value-Added', price: '200 KSH' },
    { name: 'Job Fair Organization', category: 'Value-Added', price: '1000 KSH' },
    { name: 'Salary Analysis Tool', category: 'Value-Added', price: '300 KSH' },
    { name: 'Certification Tracking', category: 'Value-Added', price: '150 KSH' },
  ];

  return (
    <div className="space-y-6 mt-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Revenue Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Monthly Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueStreams.map((stream) => (
                <TableRow key={stream.name}>
                  <TableCell className="font-medium">{stream.name}</TableCell>
                  <TableCell>{stream.category}</TableCell>
                  <TableCell>{stream.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

      <RoleCard 
        title="Community Voting Analytics"
        icon={UserCheck}
        responsibilities={[
          "Monitor business vision proposal submissions",
          "Track community votes on submitted proposals",
          "Analyze engagement with voting system",
          "Identify trending business ideas from community",
          "Provide insights on community participation"
        ]}
      />
    </div>
  );
};
