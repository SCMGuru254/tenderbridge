
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CompanyUpdate } from '@/types/careers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyUpdatesProps {
  companyId: string;
}

export const CompanyUpdates: React.FC<CompanyUpdatesProps> = ({ companyId }) => {
  const { updates, createUpdate, loading } = useCompany(companyId);
  const [showForm, setShowForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState<Partial<CompanyUpdate>>({
    title: '',
    content: '',
    type: 'general'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUpdate.title?.trim()) {
      toast.error('Update title is required');
      return;
    }

    const result = await createUpdate(newUpdate);
    if (result) {
      toast.success('Update posted successfully!');
      setShowForm(false);
      setNewUpdate({
        title: '',
        content: '',
        type: 'general'
      });
    } else {
      toast.error('Failed to post update');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Company Updates</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Update
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Update</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  value={newUpdate.title || ''}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                  placeholder="Update title"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={newUpdate.content || ''}
                  onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                  placeholder="Share your update..."
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <select
                  id="type"
                  value={newUpdate.type || 'general'}
                  onChange={(e) => setNewUpdate({ ...newUpdate, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="announcement">Announcement</option>
                  <option value="milestone">Milestone</option>
                  <option value="hiring">Hiring</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Posting...' : 'Post Update'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{update.title}</CardTitle>
                  <CardDescription>
                    {new Date(update.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="outline">{update.type}</Badge>
              </div>
            </CardHeader>
            {update.content && (
              <CardContent>
                <p className="text-muted-foreground">{update.content}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
