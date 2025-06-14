import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Import JobAlertForm and JobAlertsList with types
import { JobAlertForm } from '@/components/Jobs/JobAlertForm';
import { JobAlertsList } from '@/components/Jobs/JobAlertsList';
import { Bell, Plus } from 'lucide-react';

const JobAlertsPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Job Alerts</h1>
          <p className="text-muted-foreground">
            Set up alerts to get notified about new job opportunities
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Create Job Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JobAlertForm />
          </CardContent>
        </Card>
      )}

      <JobAlertsList />
    </div>
  );
};

export default JobAlertsPage;
