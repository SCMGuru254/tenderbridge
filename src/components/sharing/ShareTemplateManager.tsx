
import { useState } from 'react';
import { useSharing } from '@/hooks/useSharing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const ShareTemplateManager = () => {
  const { templates, createTemplate, loading } = useSharing();
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    variables: [] as string[]
  });

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result = await createTemplate(newTemplate);
    if (result) {
      toast.success('Template created successfully!');
      setNewTemplate({ name: '', content: '', variables: [] });
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Share Templates</h2>
        <Button onClick={() => setIsCreating(true)}>Create Template</Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
            <CardDescription>Create a reusable template for sharing jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Template name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            />
            <Textarea
              placeholder="Template content (use {{variable}} for dynamic content)"
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateTemplate} disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{template.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(template.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
