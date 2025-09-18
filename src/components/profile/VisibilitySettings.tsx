import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useProfile } from '@/hooks/useProfile';
import type { Profile } from '@/types/database';

interface VisibilitySettingsProps {
  userId: string;
}

export const VisibilitySettings: React.FC<VisibilitySettingsProps> = ({ userId }) => {
  const { profile, updateProfile, isLoading } = useProfile(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const handleVisibilityChange = async (value: Profile['visibility_setting']) => {
    try {
      await updateProfile({ visibility_setting: value });
    } catch (error) {
      console.error('Error updating visibility settings:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Profile Visibility</Label>
          <RadioGroup
            value={profile.visibility_setting}
            onValueChange={handleVisibilityChange}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="cursor-pointer">
                Public - Anyone can view your profile
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="connections_only" id="connections_only" />
              <Label htmlFor="connections_only" className="cursor-pointer">
                Connections Only - Only your connections can view your profile
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="cursor-pointer">
                Private - Only you can view your profile
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Label>Show Email Address</Label>
            <Switch
              checked={profile.email_visible}
              onCheckedChange={(checked) => 
                updateProfile({ email_visible: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Phone Number</Label>
            <Switch
              checked={profile.phone_visible}
              onCheckedChange={(checked) =>
                updateProfile({ phone_visible: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Social Media Links</Label>
            <Switch
              checked={profile.social_links_visible}
              onCheckedChange={(checked) =>
                updateProfile({ social_links_visible: checked })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};