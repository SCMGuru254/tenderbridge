
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PenSquare, RefreshCw } from "lucide-react";
import { NewsRefreshButton } from "@/components/NewsRefreshButton";
import { useUser } from "@/hooks/useUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

// Import our refactored components
import { FilterControls } from "@/components/blog/FilterControls";
import { ContentList } from "@/components/blog/ContentList";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { CreatePostDialog } from "@/components/blog/CreatePostDialog";
import { TenderzvilleNewsList } from "@/components/blog/TenderzvilleNewsList";

const supplyChainTags = [
  "Logistics", "Procurement", "Inventory", "Warehousing", "Transportation",
  "Manufacturing", "Distribution", "Planning", "Sustainability", "Technology",
  "Risk Management", "Global Trade", "Last Mile", "Supply Chain Finance", 
  "Circular Economy", "Career Development", "Education", "Tenders", "Kenya"
];

const Blog = () => {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }
    setCreateDialogOpen(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Blog content refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh content");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Supply Chain Insights</h1>
          <p className="text-muted-foreground mt-1">
            Latest news, updates, and insights from the supply chain industry
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2 items-center">
          {activeTab === "news" && (
            <NewsRefreshButton onRefreshComplete={() => {}} />
          )}
          {activeTab === "blog" && (
            <Button 
              onClick={handleCreatePost}
              className="flex items-center gap-2"
            >
              <PenSquare className="h-4 w-4" />
              Write Post
            </Button>
          )}
          {activeTab === "tenderzville" && (
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-3/4">
          <FilterControls 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            setSelectedTags={setSelectedTags}
            supplyChainTags={supplyChainTags}
          />

          {activeTab === "tenderzville" ? (
            <TenderzvilleNewsList 
              searchTerm={searchTerm}
              selectedTags={selectedTags}
            />
          ) : (
            <ContentList 
              activeTab={activeTab}
              searchTerm={searchTerm}
              selectedTags={selectedTags}
              handleCreatePost={handleCreatePost}
            />
          )}
        </div>
        
        <div className="w-full md:w-1/4">
          <BlogSidebar 
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            supplyChainTags={supplyChainTags}
          />
        </div>
      </div>

      <CreatePostDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        supplyChainTags={supplyChainTags}
      />
    </div>
  );
};

export default Blog;
