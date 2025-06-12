
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ProfileViewsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Views</CardTitle>
          <CardDescription>See who has viewed your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No profile views recorded yet. Share your profile to increase visibility.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
