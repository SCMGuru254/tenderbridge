
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { EnhancedSearch } from "@/components/EnhancedSearch";

interface FilterControlsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  setSelectedTags: (tags: string[]) => void;
  supplyChainTags: string[];
}

export const FilterControls = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  selectedTags,
  toggleTag,
  setSelectedTags,
  supplyChainTags
}: FilterControlsProps) => {
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="news">Latest News</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="tenderzville">Tenders</TabsTrigger>
        </TabsList>
      </Tabs>

      <EnhancedSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
        availableTags={supplyChainTags}
      />
    </div>
  );
};
