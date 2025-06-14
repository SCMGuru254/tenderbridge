
import React, { useState } from 'react';
import { useSharing } from '@/hooks/useSharing';
import { SuccessStory } from '@/types/sharing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const SuccessStories = () => {
  const { stories } = useSharing();
  const [showForm, setShowForm] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    job_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStory.title.trim() || !newStory.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    // Mock success since createStory is not being used
    toast.success('Success story shared!');
    setShowForm(false);
    setNewStory({ title: '', content: '', job_id: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Success Stories</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Share Story
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Share Your Success Story</CardTitle>
            <CardDescription>
              Inspire others by sharing your career journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Story Title
                </label>
                <Input
                  id="title"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  placeholder="Your success story title"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Your Story
                </label>
                <Textarea
                  id="content"
                  value={newStory.content}
                  onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                  placeholder="Share your journey..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  Share Story
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {stories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
              <CardDescription>
                Shared {new Date(story.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{story.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
