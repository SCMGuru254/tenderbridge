
import React from "react";
import { format } from "date-fns";
import { Eye, User } from "lucide-react";
import { ProfileView } from "@/types/profiles";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileViewsTabProps {
  profileViews: ProfileView[];
}

const ProfileViewsTab = ({ profileViews }: ProfileViewsTabProps) => {
  return (
    <>
      <h3 className="font-medium mb-4">People who viewed your profile</h3>
      {profileViews.length === 0 ? (
        <p className="text-sm text-gray-500">No one has viewed your profile yet.</p>
      ) : (
        <div className="space-y-4">
          {profileViews.map((view) => (
            <Card key={view.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {view.viewer.avatar_url ? (
                      <AvatarImage src={view.viewer.avatar_url} alt={view.viewer.full_name || "Viewer"} />
                    ) : (
                      <AvatarFallback>
                        {view.viewer.full_name ? view.viewer.full_name[0].toUpperCase() : <User />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{view.viewer.full_name}</div>
                    {view.viewer.company && (
                      <div className="text-sm text-gray-500">{view.viewer.company}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {format(new Date(view.viewed_at), "MMM d, yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileViewsTab;
