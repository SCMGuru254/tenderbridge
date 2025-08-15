import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Users, Building2, Globe } from 'lucide-react';

interface ProfileVisibilitySettingsProps {
  profile: any;
  onUpdate: (updatedProfile: any) => void;
}

export const ProfileVisibilitySettings = ({ profile, onUpdate }: ProfileVisibilitySettingsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [visibility, setVisibility] = useState(profile.visibility || 'private');
  const [visibleFields, setVisibleFields] = useState<string[]>(profile.visible_fields || []);

  const visibilityOptions = [
    {
      value: 'private',
      label: 'Private',
      description: 'Only you can see your profile',
      icon: <Lock className="h-4 w-4" />
    },
    {
      value: 'connections',
      label: 'Connections Only',
      description: 'Only your connections can see your profile',
      icon: <Users className="h-4 w-4" />
    },
    {
      value: 'recruiters',
      label: 'Recruiters & HR',
      description: 'Visible to recruiters and HR professionals',
      icon: <Building2 className="h-4 w-4" />
    },
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone can see your profile',
      icon: <Globe className="h-4 w-4" />
    }
  ];

  const fieldOptions = [
    { id: 'email', label: 'Email Address' },
    { id: 'phone', label: 'Phone Number' },
    { id: 'position', label: 'Current Position' },
    { id: 'company', label: 'Company' },
    { id: 'bio', label: 'Professional Bio' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'linkedin_url', label: 'LinkedIn Profile' }
  ];

  const handleVisibilityUpdate = async () => {
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          visibility,
          visible_fields: visibleFields
        })
        .eq('id', profile.id);

      if (error) throw error;

      onUpdate({
        ...profile,
        visibility,
        visible_fields: visibleFields
      });

      toast.success('Visibility settings updated successfully');
    } catch (error) {
      console.error('Error updating visibility settings:', error);
      toast.error('Failed to update visibility settings');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Visibility Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visibility Level */}
        <div>
          <h3 className="text-lg font-medium mb-4">Who can see your profile?</h3>
          <RadioGroup value={visibility} onValueChange={setVisibility}>
            <div className="space-y-4">
              {visibilityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex items-center gap-2">
                    {option.icon}
                    <div>
                      <span className="font-medium">{option.label}</span>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Visible Fields */}
        <div>
          <h3 className="text-lg font-medium mb-4">What information can they see?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldOptions.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={visibleFields.includes(field.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setVisibleFields([...visibleFields, field.id]);
                    } else {
                      setVisibleFields(visibleFields.filter(f => f !== field.id));
                    }
                  }}
                />
                <Label htmlFor={field.id}>{field.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleVisibilityUpdate}
          disabled={isUpdating}
          className="w-full sm:w-auto"
        >
          {isUpdating ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};
