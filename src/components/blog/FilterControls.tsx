
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
}

const FilterControls = ({
  searchTerm,
  setSearchTerm,
  selectedTags,
  onTagToggle,
  availableTags
}: FilterControlsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filter Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div>
          <p className="text-sm font-medium mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-xs border ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
