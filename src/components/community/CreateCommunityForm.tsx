
import React, { useState } from 'react';
import { useCommunity } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CreateCommunityFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { createCommunity } = useCommunity();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public' as 'public' | 'private',
    tags: [] as string[],
    rules: '',
    welcomeMessage: '',
    isModerated: true
  });

  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const result = await createCommunity({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        privacy: formData.privacy,
        tags: formData.tags,
        rules: formData.rules,
        welcomeMessage: formData.welcomeMessage,
        isModerated: formData.isModerated,
        createdBy: user.id
      });

      if (result) {
        toast({
          title: "Success",
          description: "Community created successfully!"
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const categories = [
    'Supply Chain Management',
    'Logistics',
    'Procurement',
    'Operations',
    'Technology',
    'Sustainability',
    'Career Development',
    'Industry News',
    'General Discussion'
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter community name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your community's purpose and goals"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Privacy Setting</Label>
            <Select
              value={formData.privacy}
              onValueChange={(value: 'public' | 'private') => setFormData(prev => ({ ...prev, privacy: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can join</SelectItem>
                <SelectItem value="private">Private - Approval required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">Community Rules</Label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              placeholder="Set guidelines for community members"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={formData.welcomeMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
              placeholder="Welcome message for new members"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="moderated"
              checked={formData.isModerated}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isModerated: checked }))}
            />
            <Label htmlFor="moderated">Enable moderation</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Community'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCommunityForm;
