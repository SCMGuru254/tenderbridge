
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  userInitials: string;
  onPhotoUpload: (file: File) => void;
  onPhotoRemove: () => void;
}

export const ProfilePhotoUpload = ({ 
  currentPhotoUrl, 
  userInitials, 
  onPhotoUpload, 
  onPhotoRemove 
}: ProfilePhotoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onPhotoUpload(file);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onPhotoRemove();
  };

  const displayUrl = previewUrl || currentPhotoUrl;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={displayUrl || ''} />
          <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
        </Avatar>
        {displayUrl && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={handleRemovePhoto}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground text-center">
        Upload a professional photo (max 2MB)
        <br />
        Recommended: Square image, 400x400px or larger
      </p>
    </div>
  );
};
