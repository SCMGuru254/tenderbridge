
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, MessageCircle, ExternalLink, Briefcase } from "lucide-react";
import { Profile } from "@/types/profiles";

interface EnhancedProfileCardProps {
  profile: Profile;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  showActions?: boolean;
}

export const EnhancedProfileCard = ({ 
  profile, 
  isFollowing = false, 
  onFollow, 
  onMessage,
  showActions = true 
}: EnhancedProfileCardProps) => {
  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{profile?.full_name || 'Unknown User'}</h3>
              {profile?.tagline && (
                <p className="text-sm text-blue-600 font-medium">{profile.tagline}</p>
              )}
              <p className="text-sm text-muted-foreground">{profile?.position || 'Professional'}</p>
              {profile?.company && (
                <p className="text-sm text-muted-foreground">at {profile.company}</p>
              )}
              {profile?.previous_job && (
                <div className="flex items-center gap-1 mt-1">
                  <Briefcase className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Previously: {profile.previous_job}</p>
                </div>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                onClick={onFollow}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button size="sm" variant="outline" onClick={onMessage}>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {profile?.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
        )}
        
        <div className="flex flex-wrap gap-2">
          {profile?.role && (
            <Badge variant="secondary">{profile.role}</Badge>
          )}
          {profile?.company && (
            <Badge variant="outline">{profile.company}</Badge>
          )}
        </div>

        {profile?.linkedin_url && (
          <div className="pt-2">
            <a 
              href={profile.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              LinkedIn Profile
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
