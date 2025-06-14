
import React, { useState } from 'react';
import { useCommunity } from '@/hooks/useCommunity';
import { Community } from '@/types/community';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateCommunityFormProps {
  onSuccess: (community: Community) => void;
}

export const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({ onSuccess }) => {
  const { createCommunity, loading } = useCommunity();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    is_private: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Community name is required');
      return;
    }

    const result = await createCommunity(formData);
    if (result) {
      toast.success('Community created successfully!');
      onSuccess(result);
      setFormData({ name: '', description: '', category: '', is_private: false });
    } else {
      toast.error('Failed to create community');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Community Name
        </label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter community name"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your community"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="careers">Careers</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="professional">Professional Development</SelectItem>
            <SelectItem value="networking">Networking</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="private"
          checked={formData.is_private}
          onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
        />
        <label htmlFor="private" className="text-sm">
          Make this community private
        </label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Community'}
      </Button>
    </form>
  );
};
