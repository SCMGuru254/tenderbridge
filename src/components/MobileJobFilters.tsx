
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileJobFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string | null;
  setCategory: (category: string) => void;
}

export const MobileJobFilters = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory
}: MobileJobFiltersProps) => {
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilters = () => {
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  // For desktop view, render the standard layout
  if (!isMobile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={category ?? undefined} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  // For mobile view, render a collapsible filter panel
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleFilters}
          aria-label="Toggle filters"
        >
          <Filter size={18} />
        </Button>
      </div>

      {isFilterOpen && (
        <div className="bg-background border rounded-lg p-4 shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filters</h3>
            <Button variant="ghost" size="icon" onClick={toggleFilters}>
              <X size={18} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Job Type</label>
              <Select value={category ?? undefined} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
