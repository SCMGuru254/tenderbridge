
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter, Plus, Loader2, MessageSquare } from "lucide-react";
import { DiscussionCard } from "@/components/DiscussionCard";
import { DiscussionForm } from "@/components/DiscussionForm";
import { useAuth } from "@/hooks/useAuth";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { FAB } from "@/components/ui/fab";

const supplyChainTags = [
  "Logistics", "Procurement", "Inventory", "Warehousing", "Transportation",
  "Supplier Management", "Demand Planning", "Risk Management", "Sustainability",
  "Technology", "Analytics", "Optimization", "Quality Control", "Compliance"
];

const Discussions = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const isUserLoggedIn = !!user;

  const { data: discussions, isLoading, refetch } = useQuery({
    queryKey: ["discussions", activeTab, searchTerm, selectedTags],
    queryFn: async () => {
      let query = supabase
        .from("discussions")
        .select("*")
        .order(activeTab === "latest" ? "created_at" : "likes", { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (selectedTags.length > 0) {
        query = query.overlaps("tags", selectedTags);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const filteredDiscussions = discussions?.filter(discussion => {
    const matchesSearch = !searchTerm || 
      discussion.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => discussion.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Supply Chain Discussions</h1>

          {isUserLoggedIn && (
            <>
              {/* Desktop create button */}
              <div className="hidden md:block">
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Start Discussion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Create New Discussion</DialogTitle>
                      <DialogDescription>
                        Share your thoughts, questions, or insights with the supply chain community.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <DiscussionForm onSuccess={handleCreateSuccess} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Mobile FAB */}
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <FAB aria-label="Create new discussion" />
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-3xl mx-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Discussion</DialogTitle>
                    <DialogDescription>
                      Share your thoughts, questions, or insights with the supply chain community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <DiscussionForm onSuccess={handleCreateSuccess} />
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Tabs 
                defaultValue="latest" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
                <TabsContent value="latest" className="mt-4">
                  <p className="text-sm text-muted-foreground">Most recent discussions</p>
                </TabsContent>
                <TabsContent value="popular" className="mt-4">
                  <p className="text-sm text-muted-foreground">Most engaged discussions</p>
                </TabsContent>
              </Tabs>
              
              <div className="flex w-full sm:w-auto gap-2">
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-60"
                />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter by Tags</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {supplyChainTags.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`tag-${tag}`} 
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={() => toggleTag(tag)}
                            />
                            <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                          </div>
                        ))}
                      </div>
                      {selectedTags.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedTags([])}
                          className="w-full"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredDiscussions?.length === 0 ? (
              <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No discussions found</h3>
                <p className="mb-6">Be the first to start a discussion about supply chain topics</p>
                {isUserLoggedIn && (
                  <Button 
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Start a Discussion
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredDiscussions?.map((discussion) => (
                  <DiscussionCard 
                    key={discussion.id} 
                    discussion={discussion}
                    onReport={() => refetch()}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm">
                <li>Be respectful and constructive in your discussions</li>
                <li>Share your professional experiences and insights</li>
                <li>Cite sources when sharing information</li>
                <li>Avoid self-promotion or spam</li>
                <li>Report inappropriate content</li>
              </ul>
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {supplyChainTags.slice(0, 8).map(tag => (
                    <Button 
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
};

export default Discussions;
