
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileView } from "@/types/profiles";

interface ProfileViewsTabProps {
  profileViews: ProfileView[];
}

export const ProfileViewsTab = ({ profileViews }: ProfileViewsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Views</CardTitle>
          <CardDescription>See who has viewed your profile</CardDescription>
        </CardHeader>
        <CardContent>
          {profileViews.length > 0 ? (
            <div className="space-y-4">
              {profileViews.map((view) => (
                <div key={view.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{view.viewer.full_name}</p>
                    <p className="text-sm text-muted-foreground">{view.viewer.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(view.viewed_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No profile views recorded yet. Share your profile to increase visibility.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
