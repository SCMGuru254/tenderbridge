
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import JobAlertForm from "@/components/Jobs/JobAlertForm";
import { JobAlertsList } from "@/components/Jobs/JobAlertsList";

const JobAlertsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Job Alerts</h1>
        <p className="text-gray-600">Stay updated with the latest supply chain opportunities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <JobAlertForm />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Active Alerts</CardTitle>
              <CardDescription>
                Manage your job alert preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobAlertsList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobAlertsPage;
