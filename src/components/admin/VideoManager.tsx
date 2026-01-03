import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function VideoManager() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    video_url: '',
    category: 'general'
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Supabase might return error if table doesn't exist yet
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async () => {
    try {
      if (!newVideo.video_url || !newVideo.title) {
        toast.error('Title and Video URL are required');
        return;
      }

      const { error } = await supabase
        .from('admin_videos')
        .insert({
          title: newVideo.title,
          description: newVideo.description,
          video_url: newVideo.video_url,
          category: newVideo.category,
          is_active: true
        });

      if (error) throw error;

      toast.success('Video added successfully!');
      setIsDialogOpen(false);
      fetchVideos();
      setNewVideo({ title: '', description: '', video_url: '', category: 'general' });
    } catch (error: any) {
      toast.error('Failed to add video: ' + error.message);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to remove this video?')) return;

    try {
      const { error } = await supabase
        .from('admin_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Video removed');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Video Library</h2>
          <p className="text-sm text-muted-foreground">Manage platform video content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Video Title</Label>
                <Input 
                  value={newVideo.title} 
                  onChange={e => setNewVideo({...newVideo, title: e.target.value})} 
                  placeholder="e.g., Welcome to SupplyChain KE"
                />
              </div>
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input 
                  value={newVideo.video_url} 
                  onChange={e => setNewVideo({...newVideo, video_url: e.target.value})} 
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">Direct link or YouTube URL</p>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newVideo.category} 
                  onValueChange={(val) => setNewVideo({...newVideo, category: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="ad">Advertisement</SelectItem>
                    <SelectItem value="highlight">Highlight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={newVideo.description} 
                  onChange={e => setNewVideo({...newVideo, description: e.target.value})} 
                  placeholder="Brief description..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateVideo}>Save Video</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-40 h-24 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                <PlayCircle className="h-10 w-10 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{video.title}</h3>
                    <Badge variant="outline" className="mt-1">{video.category}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteVideo(video.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{video.description}</p>
                <a href={video.video_url} target="_blank" className="text-xs text-blue-600 hover:underline mt-2 block truncate max-w-md">
                   {video.video_url}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
        {videos.length === 0 && !loading && (
          <div className="text-center p-12 bg-gray-50 rounded-lg text-muted-foreground">
            No videos found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
