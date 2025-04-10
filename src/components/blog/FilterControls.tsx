
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Tabs 
        defaultValue="news" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news">Global News</TabsTrigger>
          <TabsTrigger value="blog">Community Blog</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex w-full sm:w-auto gap-2">
        <Input
          placeholder={`Search ${activeTab === "news" ? "news" : "blog posts"}...`}
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
  );
};
