
import React from "react";
import { Briefcase, Download, Linkedin, Mail, User } from "lucide-react";
import { Profile } from "@/types/profiles";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface ProfileHeaderProps {
  profile: Profile | null;
  currentUserId: string | null;
}

const ProfileHeader = ({ profile, currentUserId }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  
  if (!profile) return null;
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Avatar className="h-20 w-20">
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
          ) : (
            <AvatarFallback className="text-2xl">
              {profile?.full_name ? profile.full_name[0].toUpperCase() : <User />}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{profile?.full_name || "Unnamed User"}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            {profile?.position && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" /> {profile.position}
              </span>
            )}
            {profile?.company && (
              <span className="flex items-center gap-1">
                at {profile.company}
              </span>
            )}
          </CardDescription>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {profile?.cv_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={profile.cv_url} target="_blank" rel="noreferrer" download>
              <Download className="h-4 w-4 mr-1" /> Download CV
            </a>
          </Button>
        )}
        {profile?.linkedin_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
              <Linkedin className="h-4 w-4 mr-1" /> LinkedIn
            </a>
          </Button>
        )}
        {profile?.email && currentUserId && currentUserId !== profile.id && (
          <Button variant="outline" size="sm" onClick={() => navigate(`/messages?to=${profile.id}`)}>
            <Mail className="h-4 w-4 mr-1" /> Message
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
