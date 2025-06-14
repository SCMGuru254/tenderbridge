
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CompanyUpdate } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface CompanyUpdatesProps {
  companyId: string;
  canCreate?: boolean;
}

const CompanyUpdates: React.FC<CompanyUpdatesProps> = ({ companyId, canCreate = false }) => {
  const { updates, loading, createUpdate } = useCompany(companyId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    type: 'general' as string
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUpdate({
        content: formData.content,
        type: formData.type,
        authorName: 'Company Admin' // This would come from the current user
      });
      
      setShowForm(false);
      setFormData({
        content: '',
        type: 'general'
      });
      
      toast({
        title: "Success",
        description: "Update posted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post update. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getUpdateTypeColor = (type: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      announcement: 'bg-green-100 text-green-800',
      job_posting: 'bg-purple-100 text-purple-800',
      event: 'bg-orange-100 text-orange-800',
      achievement: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || colors.general;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div>Loading updates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Company Updates</h2>
        {canCreate && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post Update
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Update</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Update Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="job_posting">Job Posting</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="What's happening at your company?"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Post Update</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {updates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No updates yet.</p>
        ) : (
          updates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt="Company" />
                    <AvatarFallback>CO</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{update.authorName}</span>
                      <Badge className={getUpdateTypeColor(update.type)}>
                        {update.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(update.publishedAt)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{update.content}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {update.likesCount || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {update.commentsCount || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyUpdates;
