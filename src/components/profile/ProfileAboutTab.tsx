
import React from "react";
import { Mail, User } from "lucide-react";
import { Profile } from "@/types/profiles";

interface ProfileAboutTabProps {
  profile: Profile | null;
}

const ProfileAboutTab = ({ profile }: ProfileAboutTabProps) => {
  if (!profile) return null;
  
  return (
    <div className="space-y-4">
      {profile?.bio && (
        <div>
          <h3 className="font-medium mb-2">Bio</h3>
          <p className="text-sm text-gray-600">{profile.bio}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile?.email && (
          <div>
            <h3 className="font-medium mb-1">Email</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Mail className="h-4 w-4" /> {profile.email}
            </p>
          </div>
        )}
        {profile?.role && (
          <div>
            <h3 className="font-medium mb-1">Role</h3>
            <p className="text-sm text-gray-600 capitalize">{profile.role.replace('_', ' ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAboutTab;
