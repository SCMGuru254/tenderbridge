
import { useState } from 'react';
import { useSharing } from '@/hooks/useSharing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const SuccessStories = () => {
  const { stories, createStory, loading } = useSharing();
  const [isCreating, setIsCreating] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    job_id: ''
  });

  const handleCreateStory = async () => {
    if (!newStory.title.trim() || !newStory.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result = await createStory(newStory);
    if (result) {
      toast.success('Success story shared!');
      setNewStory({ title: '', content: '', job_id: '' });
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Success Stories</h2>
        <Button onClick={() => setIsCreating(true)}>Share Your Story</Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Share Your Success Story</CardTitle>
            <CardDescription>Inspire others with your job search success</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Story title"
              value={newStory.title}
              onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
            />
            <Textarea
              placeholder="Tell your success story..."
              value={newStory.content}
              onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateStory} disabled={loading}>
                {loading ? 'Sharing...' : 'Share Story'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {stories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle className="text-lg">{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{story.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Shared: {new Date(story.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
