
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const clearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="mb-6 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="news">Supply Chain News</TabsTrigger>
          <TabsTrigger value="blog">Community Posts</TabsTrigger>
          <TabsTrigger value="tenderzville">Tenderzville Blog</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="sm:w-[150px] flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter by Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filter by tags</h4>
                {selectedTags.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearTags}
                    className="h-7 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {supplyChainTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
              
              <div className="pt-2 text-right">
                <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="text-sm text-muted-foreground pt-1">Active filters:</div>
          {selectedTags.map(tag => (
            <Badge 
              key={tag}
              variant="secondary"
              className="pl-2 flex items-center gap-1"
            >
              {tag}
              <Button
                size="icon"
                variant="ghost"
                className="h-4 w-4 p-0"
                onClick={() => toggleTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearTags}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};
