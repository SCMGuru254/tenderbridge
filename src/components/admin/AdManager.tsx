import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Eye, MousePointerClick, Calendar } from "lucide-react";
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

export function AdManager() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    image_url: '',
    target_url: '',
    position: 'header',
    duration_days: 7
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast.error('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = async () => {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + newAd.duration_days);

      const { error } = await supabase
        .from('ads')
        .insert({
          title: newAd.title,
          image_url: newAd.image_url,
          target_url: newAd.target_url,
          position: newAd.position,
          starts_at: new Date().toISOString(),
          ends_at: expiresAt.toISOString(),
          is_active: true
        });

      if (error) throw error;

      toast.success('Ad created successfully!');
      setIsDialogOpen(false);
      fetchAds();
      setNewAd({ title: '', image_url: '', target_url: '', position: 'header', duration_days: 7 });
    } catch (error: any) {
      toast.error('Failed to create ad: ' + error.message);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Ad deleted');
      fetchAds();
    } catch (error) {
      toast.error('Failed to delete ad');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Active Campaigns</h2>
          <p className="text-sm text-muted-foreground">Manage platform advertisements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Advertisement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Campaign Title</Label>
                <Input 
                  value={newAd.title} 
                  onChange={e => setNewAd({...newAd, title: e.target.value})} 
                  placeholder="e.g., Summer Sale Banner"
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input 
                  value={newAd.image_url} 
                  onChange={e => setNewAd({...newAd, image_url: e.target.value})} 
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Target Link</Label>
                <Input 
                  value={newAd.target_url} 
                  onChange={e => setNewAd({...newAd, target_url: e.target.value})} 
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Position</Label>
                    <select 
                        className="w-full p-2 border rounded-md"
                        value={newAd.position} 
                        onChange={e => setNewAd({...newAd, position: e.target.value})}
                    >
                        <option value="header">Header</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="footer">Footer</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Duration (Days)</Label>
                    <Input 
                        type="number" 
                        min="1"
                        value={newAd.duration_days} 
                        onChange={e => setNewAd({...newAd, duration_days: parseInt(e.target.value)})} 
                    />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateAd}>Launch Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {ads.map((ad) => (
          <Card key={ad.id} className="overflow-hidden">
            <CardContent className="p-0 flex items-stretch">
              <div className="w-48 bg-gray-100 flex-shrink-0 relative">
                <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover absolute inset-0" />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{ad.title}</h3>
                            <a href={ad.target_url} target="_blank" className="text-sm text-blue-600 hover:underline truncate block max-w-sm">{ad.target_url}</a>
                        </div>
                        <Badge variant={new Date(ad.ends_at) > new Date() ? 'default' : 'secondary'}>
                            {new Date(ad.ends_at) > new Date() ? 'ACTIVE' : 'EXPIRED'}
                        </Badge>
                    </div>
                    <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {ad.views || 0} views
                        </div>
                        <div className="flex items-center gap-1">
                            <MousePointerClick className="h-4 w-4" />
                            {ad.clicks || 0} clicks
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Ends {new Date(ad.ends_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        End Campaign
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {ads.length === 0 && !loading && (
            <div className="text-center p-12 bg-gray-50 rounded-lg text-muted-foreground">
                No active advertisements. Create one to get started.
            </div>
        )}
      </div>
    </div>
  );
}
