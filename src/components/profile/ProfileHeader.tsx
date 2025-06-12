
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  profile: any;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name || 'Unknown User'}</h1>
            <p className="text-muted-foreground">{profile?.email}</p>
            {profile?.position && (
              <p className="text-sm text-muted-foreground">{profile.position}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
