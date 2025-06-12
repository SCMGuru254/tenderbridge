
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileAboutTabProps {
  profile: any;
}

export const ProfileAboutTab = ({ profile }: ProfileAboutTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Professional information and background</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile?.bio ? (
              <p>{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground">No bio available</p>
            )}
            
            {profile?.company && (
              <div>
                <h4 className="font-medium">Company</h4>
                <p className="text-muted-foreground">{profile.company}</p>
              </div>
            )}
            
            {profile?.position && (
              <div>
                <h4 className="font-medium">Position</h4>
                <p className="text-muted-foreground">{profile.position}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
