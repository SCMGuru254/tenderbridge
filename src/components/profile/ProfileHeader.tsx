
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileHeaderProps {
  profile: any;
  onProfileUpdate?: (updatedProfile: any) => void;
}

export const ProfileHeader = ({ profile, onProfileUpdate }: ProfileHeaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U';

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${profile.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Delete old avatar if it exists
      if (profile.avatar_url) {
        const oldFilePath = profile.avatar_url.split('/').slice(-2).join('/');
        await supabase.storage
          .from('avatars')
          .remove([oldFilePath]);
      }

      toast.success('Profile picture updated successfully');
      
      // Update local state if callback provided
      if (onProfileUpdate) {
        onProfileUpdate({
          ...profile,
          avatar_url: publicUrl
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            
            <label 
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full 
                opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </label>
          </div>

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
